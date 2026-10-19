"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { advertisingConsentGranted, analyticsConsentGranted, flushPendingMetaLead, trackMetaPageView } from "@/lib/analytics";

export function AnalyticsRuntime() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(false);
  const pagePath = useRef("");
  const pathname = usePathname();
  const publicRoute = !pathname.startsWith("/admin") && !pathname.startsWith("/auth");

  useEffect(() => {
    const update = () => { setAnalyticsEnabled(analyticsConsentGranted()); setAdvertisingEnabled(advertisingConsentGranted()); };
    update();
    window.addEventListener("vetta:analytics-consent", update);
    return () => window.removeEventListener("vetta:analytics-consent", update);
  }, []);

  useEffect(() => {
    if (!advertisingEnabled || !publicRoute) return;
    const path = window.location.pathname + window.location.search;
    if (path === pagePath.current) return;
    pagePath.current = path;
    trackMetaPageView();
    flushPendingMetaLead();
  }, [advertisingEnabled, publicRoute]);

  if ((!analyticsEnabled && !advertisingEnabled) || !publicRoute) return null;
  return <>
    {advertisingEnabled && <Script id="vetta-meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","3337529346452736");` }} />}
    {analyticsEnabled && <Script id="vetta-clarity" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)}(window,document,"clarity","script","z0c14ujntu");clarity("consent");` }} />}
  </>;
}
