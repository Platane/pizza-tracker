import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { createChartRenderer } from "@pizza-tracker/chart-renderer";
import { useLines } from "./_hooks/useLines";
import { inverseLerp, clamp } from "../utils/math";

export const Chart = ({ users, limit, date, ...props }) => {
  const ref = useRef(null as any);
  const renderer = useRef(null as any);
  const lines = useLines(users, limit);
  const k = inverseLerp(limit[0], limit[1])(date) * 12;

  // init renderer on the canvas
  useEffect(() => {
    renderer.current = createChartRenderer(ref.current);
    renderer.current.setRunning(true);
    renderer.current.resize();
    renderer.current.setK(k);
    renderer.current.setLines(lines);

    return () => {
      renderer.current.setRunning(false);
    };
  }, []);

  // propagate k
  useEffect(() => {
    if (!renderer.current) return;

    renderer.current.setK(k);
  }, [k]);

  // propagate lines
  useEffect(() => {
    if (!renderer.current) return;

    renderer.current.setLines(lines);
  }, [lines]);

  // listen to mouse move to update camera
  useEffect(() => {
    const onMouseMove = event => {
      const tx = event.clientX / window.innerWidth - 0.5;
      const ty = event.clientY / window.innerHeight - 0.5;

      renderer.current.setCamera(tx, ty);
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // listen to device orientation to update camera
  useEffect(() => {
    if (!window.DeviceOrientationEvent) return;

    const onDeviceRotate = event => {
      const tx = clamp(-0.5, 0.5)(event.gamma / 90);
      const ty = clamp(-0.4, 0.6)(event.beta / 90);

      renderer.current.setCamera(tx, ty);
    };

    window.addEventListener("deviceorientation", onDeviceRotate);

    return () => {
      window.removeEventListener("deviceorientation", onDeviceRotate);
    };
  }, []);

  // listen to resize
  useEffect(() => {
    const onResize = () => {
      renderer.current.resize();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <Canvas {...props} ref={ref} />;
};

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
