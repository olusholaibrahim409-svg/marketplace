"use client";

import { useEffect, useState } from "react";

type FlashSaleCountdownProps = {
endsAt: string;
};

function getTimeRemaining(endsAt: string) {
const difference =
new Date(endsAt).getTime() - Date.now();

if (difference <= 0) {
return {
total: 0,
days: 0,
hours: 0,
minutes: 0,
seconds: 0,
};
}

const totalSeconds = Math.floor(
difference / 1000
);

return {
total: difference,
days: Math.floor(
totalSeconds / (60 * 60 * 24)
),
hours: Math.floor(
(totalSeconds % (60 * 60 * 24)) /
(60 * 60)
),
minutes: Math.floor(
(totalSeconds % (60 * 60)) / 60
),
seconds:
totalSeconds % 60,
};
}

function pad(value: number) {
return String(value).padStart(2, "0");
}

export default function FlashSaleCountdown({
endsAt,
}: FlashSaleCountdownProps) {
const [time, setTime] = useState(() =>
getTimeRemaining(endsAt)
);

useEffect(() => {
const updateCountdown = () => {
setTime(getTimeRemaining(endsAt));
};


updateCountdown();

const interval = setInterval(
  updateCountdown,
  1000
);

return () => {
  clearInterval(interval);
};


}, [endsAt]);

if (time.total <= 0) {
return ( <div className="mt-2 text-xs font-bold text-red-600">
Flash Sale ended </div>
);
}

return ( <div className="mt-2"> <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
Ends in </p>


  <div className="mt-1 flex items-center justify-end gap-1.5">
    {time.days > 0 && (
      <>
        <span className="rounded-md bg-gray-950 px-2 py-1 text-xs font-black text-white">
          {pad(time.days)}
        </span>

        <span className="text-xs font-bold text-gray-500">
          d
        </span>
      </>
    )}

    <span className="rounded-md bg-gray-950 px-2 py-1 text-xs font-black text-white">
      {pad(time.hours)}
    </span>

    <span className="text-xs font-bold text-gray-500">
      h
    </span>

    <span className="rounded-md bg-gray-950 px-2 py-1 text-xs font-black text-white">
      {pad(time.minutes)}
    </span>

    <span className="text-xs font-bold text-gray-500">
      m
    </span>

    <span className="rounded-md bg-orange-600 px-2 py-1 text-xs font-black text-white">
      {pad(time.seconds)}
    </span>

    <span className="text-xs font-bold text-gray-500">
      s
    </span>
  </div>
</div>


);
}
