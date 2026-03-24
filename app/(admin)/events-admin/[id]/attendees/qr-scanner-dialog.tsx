"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle, XCircle, Loader2, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkInByQRCode } from "@/lib/actions/event-attendees";

interface QRScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onCheckIn: (attendeeId: string) => void;
}

type ScanResult = {
  success: boolean;
  message: string;
  attendeeName?: string;
  attendeeId?: string;
};

export function QRScannerDialog({
  open,
  onOpenChange,
  eventId,
  onCheckIn,
}: QRScannerDialogProps) {
  const [manualToken, setManualToken] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on unmount or close
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Stop camera when dialog closes
  useEffect(() => {
    if (!open && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsScanning(false);
    }
  }, [open]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsScanning(true);
      startScanning();
    } catch {
      setCameraError(
        "Unable to access camera. Please use manual entry or check camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    // In a real implementation, you would use a library like @zxing/browser
    // For now, we'll rely on manual entry
    // This is a placeholder for QR code scanning logic
  };

  const processToken = async (token: string) => {
    if (!token.trim()) return;

    setIsProcessing(true);
    setScanResult(null);

    const result = await checkInByQRCode(token.trim());

    if (result.success && result.data) {
      // Verify this is for the correct event
      if (result.data.event_id !== eventId) {
        setScanResult({
          success: false,
          message: "This ticket is for a different event",
        });
      } else if (result.data.checked_in) {
        setScanResult({
          success: true,
          message: "Already checked in",
          attendeeName: `${result.data.first_name} ${result.data.last_name}`,
          attendeeId: result.data.id,
        });
      } else {
        setScanResult({
          success: true,
          message: "Successfully checked in!",
          attendeeName: `${result.data.first_name} ${result.data.last_name}`,
          attendeeId: result.data.id,
        });
        onCheckIn(result.data.id);
      }
    } else {
      setScanResult({
        success: false,
        message: result.error || "Invalid QR code or ticket not found",
      });
    }

    setIsProcessing(false);
    setManualToken("");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processToken(manualToken);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Check-in
          </DialogTitle>
          <DialogDescription>
            Scan a ticket QR code or enter the token manually to check in an
            attendee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Camera View */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-lg" />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={stopCamera}
                  className="absolute bottom-4 right-4"
                >
                  Stop Camera
                </Button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1A1A1A]">
                <Camera className="h-12 w-12 text-[#888888]" />
                <Button
                  onClick={startCamera}
                  className="bg-[#C9A84C] hover:bg-[#A68A2E] text-black"
                >
                  Start Camera
                </Button>
                {cameraError && (
                  <p className="text-sm text-red-400 text-center px-4">
                    {cameraError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <p className="text-sm text-[#888888]">Or enter QR token manually:</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                placeholder="FF-XXXXXXXX-XXXXXXXXXXXX-XXXXX"
                className="font-mono text-sm"
              />
              <Button
                type="submit"
                disabled={isProcessing || !manualToken.trim()}
                className="bg-[#5A7247] hover:bg-[#3D5030] text-white"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Check In"
                )}
              </Button>
            </form>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div
              className={`rounded-lg p-4 flex items-start gap-3 ${
                scanResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {scanResult.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    scanResult.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {scanResult.message}
                </p>
                {scanResult.attendeeName && (
                  <p
                    className={`text-sm ${
                      scanResult.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {scanResult.attendeeName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-[#FAFAF8] rounded-lg p-4 text-sm text-[#555555]">
            <p className="font-medium mb-2">Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-[#888888]">
              <li>Hold the QR code steady within the frame</li>
              <li>Ensure adequate lighting</li>
              <li>QR token format: FF-XXXXXXXX-XXXXXXXXXXXX-XXXXX</li>
              <li>Only paid tickets can be checked in</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
