"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { advertisingConsentGranted, analyticsConsentGranted, applyVendorConsent, flushPendingMetaLead, markMetaPixelScriptReady, shouldTrackPageView, trackMetaPageView } from "@/lib/analytics";

export function AnalyticsRuntime() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(false);
  const [metaPixelReady, setMetaPixelReady] = useState(false);
  const pagePath = useRef("");
  const pathname = usePathname();
  const publicRoute = !pathname.startsWith("/admin") && !pathname.startsWith("/auth");

  useEffect(() => {
    const update = () => { setAnalyticsEnabled(analyticsConsentGranted()); setAdvertisingEnabled(advertisingConsentGranted()); applyVendorConsent(); };
    update();
    window.addEventListener("vetta:analytics-consent", update);
    return () => window.removeEventListener("vetta:analytics-consent", update);
  }, []);

  useEffect(() => {
    if (!advertisingEnabled || !metaPixelReady || !publicRoute) return;
    const path = pathname;
    // Flush a conversion queued before advertising consent, even if the user
    // grants consent without navigating to a new page.
    flushPendingMetaLead();
    if (!shouldTrackPageView(path, pagePath.current)) return;
    pagePath.current = path;
    trackMetaPageView();
  }, [advertisingEnabled, metaPixelReady, pathname, publicRoute]);

  function handleMetaPixelReady() {
    markMetaPixelScriptReady();
    setMetaPixelReady(true);
  }

  if (!publicRoute) return null;
  return <>
    <Script id="vetta-meta-pixel-bootstrap" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[]}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");`}</Script>
    {/* The visitor can disable Meta measurement using the privacy preferences link. */}
    {advertisingEnabled && (
      <Script id="vetta-meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" onReady={handleMetaPixelReady} />
    )}
    {analyticsEnabled && (
      <Script id="vetta-clarity" strategy="afterInteractive" onReady={applyVendorConsent} dangerouslySetInnerHTML={{ __html: `!function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)}(window,document,"clarity","script","z0c14ujntu");clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"denied"});` }} />
    )}
  </>;
}
