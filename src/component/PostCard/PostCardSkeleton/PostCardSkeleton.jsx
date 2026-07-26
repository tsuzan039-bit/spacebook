import React from "react";
import { Card } from "flowbite-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './skeleton.css'
export default function PostCardSkeleton() {
  return (
    <SkeletonTheme
      baseColor="#0d1630"
      highlightColor="#1b2b55"
      duration={1.6}
    >
      <Card className="space-skeleton-card w-full my-6">

        {/* User */}
        <div className="flex items-center gap-4">
          <Skeleton circle width={55} height={55} />

          <div className="flex flex-col gap-2 flex-1">
            <Skeleton width="35%" height={14} />
            <Skeleton width="20%" height={10} />
          </div>

          <Skeleton circle width={35} height={35} />
        </div>

        {/* Content */}
        <div className="mt-6 space-y-3">
          <Skeleton height={14} />
          <Skeleton width="92%" height={14} />
          <Skeleton width="70%" height={14} />
        </div>

        {/* Image */}
        <div className="mt-5">
          <Skeleton
            height={340}
            borderRadius={22}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-5">
          <Skeleton width={80} height={28} />
          <Skeleton width={80} height={28} />
          <Skeleton width={80} height={28} />
          <Skeleton width={80} height={28} />
        </div>

      </Card>
    </SkeletonTheme>
  );
}