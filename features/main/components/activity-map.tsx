"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { decode } from "@googlemaps/polyline-codec";

interface ActivityMapProps {
  polyline?: string;
  className?: string;
}

export interface ActivityMapRef {
  getImage: () => string | undefined;
}

export const ActivityMap = forwardRef<ActivityMapRef, ActivityMapProps>(
  ({ polyline, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useImperativeHandle(ref, () => ({
      // getCoords: () => center,
      getImage() {
        return canvasRef.current?.toDataURL("image/png");
      },
    }));

    // Handle Resize
    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
          });
        }
      };

      handleResize(); // Initial measurement
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Drawing Logic
    useEffect(() => {
      if (
        !polyline ||
        dimensions.width === 0 ||
        dimensions.height === 0 ||
        !canvasRef.current
      )
        return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle Device Pixel Ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;

      // Normalize coordinate system to use css pixels
      ctx.scale(dpr, dpr);

      // Decode polyline [lat, lng]
      const path = decode(polyline, 5);

      if (path.length === 0) return;

      // Find Bounding Box
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;

      path.forEach(([lat, lng]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;

      const padding = 20;
      const usableWidth = dimensions.width - padding * 2;
      const usableHeight = dimensions.height - padding * 2;

      // Calculate scale to fit
      const scaleX = usableWidth / (lngDiff || 1);
      const scaleY = usableHeight / (latDiff || 1);
      const scale = Math.min(scaleX, scaleY);

      // Calculate offsets to center the path
      const xOffset = (dimensions.width - lngDiff * scale) / 2;
      const yOffset = (dimensions.height - latDiff * scale) / 2;

      // Set Background Color
      // ctx.fillStyle = "#111317";
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw the path
      ctx.beginPath();
      ctx.strokeStyle = "#C3F400"; // Lime Primary
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      path.forEach(([lat, lng], index) => {
        // Longitude maps to X, Latitude maps to Y (inverted)
        const x = (lng - minLng) * scale + xOffset;
        const y = dimensions.height - ((lat - minLat) * scale + yOffset);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }, [polyline, dimensions]);

    if (!polyline) return null;

    return (
      <>
        <div
          ref={containerRef}
          className={`w-full h-full rounded-2xl overflow-hidden ${className || ""}`}
        >
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full block"
          />
        </div>
      </>
    );
  },
);

ActivityMap.displayName = "ActivityMap";
