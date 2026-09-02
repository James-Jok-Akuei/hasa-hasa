"use client";

import { useEffect, useRef, useState } from "react";

/** One delivery run: out to the gate, hand over, and away again. */
const RUN = "12s";
/** One round trip on foot: over to the restaurant, then home with the food. */
const WALK = "15s";

/**
 * Two roads out of one restaurant.
 *
 * Upper lane — we deliver: the rider carries an order out, eases off as they
 * reach the gate, meets the customer coming out to receive it, hands the box
 * over, and heads off. The customer walks back in with it.
 *
 * Lower lane — you collect: someone walks over empty-handed and carries their
 * own order home.
 *
 * The track is measured and the paths drawn in real pixels; a stretched
 * viewBox would squash the avatars into ovals.
 */
export function RouteThread() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    setAnimated(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Both lanes leave the same door and fan out to their own destination
  const origin = Math.round(h / 2);
  const lift = 26; // delivery lane, riding high
  const drop = Math.max(h - 22, lift + 20); // pickup lane, down below

  const deliveryPath = w
    ? `M0 ${origin} C ${Math.round(w * 0.45)} ${origin}, ${Math.round(w * 0.55)} ${lift}, ${w} ${lift}`
    : "";
  const pickupPath = w
    ? `M0 ${origin} C ${Math.round(w * 0.45)} ${origin}, ${Math.round(w * 0.55)} ${drop}, ${w} ${drop}`
    : "";

  return (
    <div className="px-6 py-1 lg:px-[5.5%] lg:py-2">
      <div className="flex h-28 items-stretch gap-2 text-neutral-900 sm:h-32 sm:gap-4">
        {/* One origin for both journeys */}
        <div className="flex shrink-0 items-center gap-2">
          <Pin />
          <span className="whitespace-nowrap text-[0.55rem] font-extrabold uppercase tracking-[0.22em] sm:text-[0.65rem]">
            Restaurant
          </span>
        </div>

        <div ref={trackRef} className="relative h-full min-w-0 flex-1">
          {w > 0 ? (
            <svg
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              aria-hidden
              className="absolute inset-0 overflow-visible"
            >
              {[deliveryPath, pickupPath].map((d, i) => (
                <g key={i}>
                  {/* Black dashes, then white ones dropped into the gaps */}
                  <path
                    d={d}
                    fill="none"
                    stroke="#171717"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    strokeDashoffset="-5"
                  />
                </g>
              ))}

              {/* We deliver: rider runs out, slows into the gate, hands over */}
              <g>
                {animated ? (
                  <animate
                    attributeName="opacity"
                    dur={RUN}
                    repeatCount="indefinite"
                    values="1;1;0;0;1;1"
                    keyTimes="0;0.62;0.66;0.94;0.98;1"
                  />
                ) : null}
                <circle r="12" fill="#171717" />
                <g
                  transform="translate(-9,-9)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="4" cy="12.8" r="2.4" />
                  <circle cx="14" cy="12.8" r="2.4" />
                  <path d="M6.4 12.8h5.2" />
                  <path d="M14 12.8V6.4h-2.5" />
                  <path d="M2.2 4h2.2l2.1 8.8" />
                </g>

                {/* the order, until it changes hands */}
                <g>
                  <Package x={-17} y={-21} />
                  {animated ? (
                    <animate
                      attributeName="opacity"
                      dur={RUN}
                      repeatCount="indefinite"
                      values="1;1;0;0;1;1"
                      keyTimes="0;0.575;0.58;0.90;0.91;1"
                    />
                  ) : null}
                </g>

                {animated ? (
                  <animateMotion
                    dur={RUN}
                    repeatCount="indefinite"
                    rotate="auto"
                    calcMode="linear"
                    keyPoints="0;0.70;0.90;0.90;0;0"
                    keyTimes="0;0.32;0.50;0.70;0.705;1"
                    path={deliveryPath}
                  />
                ) : null}
              </g>

              {/* …and the customer who comes out to the gate to receive it */}
              {animated ? (
                <g opacity="0">
                  <animate
                    attributeName="opacity"
                    dur={RUN}
                    repeatCount="indefinite"
                    values="0;0;1;1;0;0"
                    keyTimes="0;0.42;0.46;0.78;0.82;1"
                  />
                  <Walker dur={RUN} swapAt={0.58} animated>
                    <animateMotion
                      dur={RUN}
                      repeatCount="indefinite"
                      calcMode="linear"
                      keyPoints="1;1;0.92;0.92;1;1"
                      keyTimes="0;0.44;0.55;0.62;0.74;1"
                      path={deliveryPath}
                    />
                  </Walker>
                </g>
              ) : null}

              {/* Or collect it: walker takes the lower lane, out empty, back full */}
              <Walker dur={WALK} swapAt={0.5} animated={animated}>
                {animated ? (
                  <animateMotion
                    dur={WALK}
                    repeatCount="indefinite"
                    keyPoints="1;0;1"
                    keyTimes="0;0.5;1"
                    calcMode="linear"
                    path={pickupPath}
                  />
                ) : null}
              </Walker>
            </svg>
          ) : null}
        </div>

        {/* Two destinations, one per lane */}
        <div className="flex shrink-0 flex-col justify-between pb-2 pt-3">
          <Destination label="Your door" note="we deliver" />
          <Destination label="You collect" note="pick it up" />
        </div>
      </div>
    </div>
  );
}

/**
 * A walking figure. Empty-handed with arms swinging until `swapAt` (a fraction
 * of `dur`), then carrying the order overhead for the rest of the loop.
 */
function Walker({
  dur,
  swapAt,
  animated,
  children,
}: {
  dur: string;
  swapAt: number;
  animated: boolean;
  children?: React.ReactNode;
}) {
  const swap = `0;${(swapAt - 0.004).toFixed(3)};${swapAt.toFixed(3)};1`;
  const stride = (lead: string, follow: string, mid: string) =>
    `${lead};${mid};${follow};${mid};${lead}`;

  return (
    <g>
      <circle r="12" fill="#ffffff" />
      <g transform="translate(-10,-10)" stroke="#171717" fill="none">
        <circle cx="10" cy="6.4" r="1.9" fill="#171717" stroke="none" />
        <g strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 8.6v3.6" />

          {/* arms swinging — nothing to carry yet */}
          <g opacity={animated ? 1 : 0}>
            <path d="M10 9.4l-2.3 2.7">
              {animated ? (
                <animate
                  attributeName="d"
                  dur="0.62s"
                  repeatCount="indefinite"
                  values={stride(
                    "M10 9.4l-2.3 2.7",
                    "M10 9.4l2.3 2.7",
                    "M10 9.4l0.3 3.2",
                  )}
                />
              ) : null}
            </path>
            <path d="M10 9.4l2.3 2.7">
              {animated ? (
                <animate
                  attributeName="d"
                  dur="0.62s"
                  repeatCount="indefinite"
                  values={stride(
                    "M10 9.4l2.3 2.7",
                    "M10 9.4l-2.3 2.7",
                    "M10 9.4l0.3 3.2",
                  )}
                />
              ) : null}
            </path>
            {animated ? (
              <animate
                attributeName="opacity"
                dur={dur}
                repeatCount="indefinite"
                values="1;1;0;0"
                keyTimes={swap}
              />
            ) : null}
          </g>

          {/* arms raised — holding the box overhead */}
          <g opacity={animated ? 0 : 1}>
            <path d="M10 9.4L7.2 3.4" />
            <path d="M10 9.4L12.8 3.4" />
            {animated ? (
              <animate
                attributeName="opacity"
                dur={dur}
                repeatCount="indefinite"
                values="0;0;1;1"
                keyTimes={swap}
              />
            ) : null}
          </g>

          {/* legs — striding in opposite phase throughout */}
          <path d="M10 12.2l-2.6 4.4">
            {animated ? (
              <animate
                attributeName="d"
                dur="0.62s"
                repeatCount="indefinite"
                values={stride(
                  "M10 12.2l-2.6 4.4",
                  "M10 12.2l2.6 4.4",
                  "M10 12.2l0.5 4.7",
                )}
              />
            ) : null}
          </path>
          <path d="M10 12.2l2.6 4.4">
            {animated ? (
              <animate
                attributeName="d"
                dur="0.62s"
                repeatCount="indefinite"
                values={stride(
                  "M10 12.2l2.6 4.4",
                  "M10 12.2l-2.6 4.4",
                  "M10 12.2l0.5 4.7",
                )}
              />
            ) : null}
          </path>
        </g>
      </g>

      {/* the order, once it's in hand */}
      <g opacity={animated ? 0 : 1}>
        <Package x={-8} y={-18.5} />
        {animated ? (
          <animate
            attributeName="opacity"
            dur={dur}
            repeatCount="indefinite"
            values="0;0;1;1"
            keyTimes={swap}
          />
        ) : null}
      </g>

      {children}
    </g>
  );
}

function Destination({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-right text-[0.55rem] font-extrabold uppercase tracking-[0.22em] sm:text-[0.65rem]">
        {label}
        <span className="ml-1.5 font-bold text-neutral-900/60">{note}</span>
      </span>
      <Pin />
    </div>
  );
}

/** A takeaway box wearing the HASA HASA mark. */
function Package({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="16"
        height="11"
        rx="2"
        fill="#ffffff"
        stroke="#171717"
        strokeWidth="0.9"
      />
      <path
        d={`M${x} ${y + 3.4}h16`}
        stroke="#171717"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <image href="/icon.svg" x={x + 4.5} y={y + 4.4} width="7" height="5.6" />
    </g>
  );
}

/** Map pin: teardrop with a knocked-out centre, over a small ground shadow. */
function Pin() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-6 shrink-0 sm:size-7"
    >
      <ellipse cx="12" cy="21.2" rx="4.2" ry="1.3" opacity="0.9" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.6a7.4 7.4 0 0 0-7.4 7.4c0 5.3 7.4 11.6 7.4 11.6s7.4-6.3 7.4-11.6A7.4 7.4 0 0 0 12 1.6Zm0 4.6a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z"
      />
    </svg>
  );
}
