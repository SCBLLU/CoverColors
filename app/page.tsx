"use client";

import React, { useState, useRef, useEffect } from "react";
import chroma from "chroma-js";

export default function Generador() {
  const [baseColor, setBaseColor] = useState("#3498db");
  const [stripCount, setStripCount] = useState(6);
  const [stripWidth, setStripWidth] = useState(50);
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      const newPalette = chroma
        .scale([
          chroma(baseColor).brighten(2),
          baseColor,
          chroma(baseColor).darken(2),
        ])
        .mode("lch")
        .colors(stripCount);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPalette(newPalette);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      //
    }
  }, [baseColor, stripCount]);

  const handleDownload = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const height = 300;

    canvas.width = stripWidth * stripCount;
    canvas.height = height;

    palette.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * stripWidth, 0, stripWidth, height);
    });

    const link = document.createElement("a");
    link.download = `paleta-${baseColor}.jpeg`;
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight">Cover Color</h1>
          <p className="mt-2 text-base text-gray-600">
            Genera paletas monocromáticas limpias y profesionales
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Personalización</h2>

              {/* Color Base */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color Base
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="h-12 w-14 cursor-pointer rounded border border-gray-300 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 rounded border border-gray-300 px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>

              {/* Strip Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Cantidad de Franjas
                  </label>
                  <span className="text-lg font-semibold text-gray-900">
                    {stripCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={stripCount}
                  onChange={(e) => setStripCount(parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-gray-400"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>3</span>
                  <span>20</span>
                </div>
              </div>

              {/* Strip Width */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ancho de cada franja (px)
                </label>
                <input
                  type="number"
                  value={stripWidth || ""}
                  onChange={(e) =>
                    setStripWidth(parseInt(e.target.value) || 50)
                  }
                  min="20"
                  max="200"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white transition-all hover:bg-gray-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                ⬇️ Descargar JPEG
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Palette Strips */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Vista Previa
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="flex h-48">
                  {[...palette].reverse().map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: color,
                        width: `${stripWidth}px`,
                      }}
                      onClick={() => copyToClipboard(color)}
                      className="flex flex-1 cursor-pointer items-center justify-center transition-opacity hover:opacity-90"
                      title="Click para copiar"
                    >
                      <span className="select-none font-mono text-xs font-bold text-white drop-shadow">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Paleta Completa
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...palette].reverse().map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyToClipboard(color)}
                    className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md active:scale-95"
                  >
                    <div
                      style={{ backgroundColor: color }}
                      className="h-24 w-full transition-opacity hover:opacity-90"
                    />
                    <div className="bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">
                        Color {idx + 1}
                      </p>
                      <p className="font-mono font-bold text-gray-900">
                        {color}
                      </p>
                      {copiedColor === color && (
                        <p className="mt-1 text-xs font-semibold text-green-600">
                          ✓ Copiado
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Canvas Oculto */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
