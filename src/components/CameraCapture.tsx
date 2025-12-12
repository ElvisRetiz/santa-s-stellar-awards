import { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CameraCaptureProps {
  voterName: string;
  onPhotoTaken: (photoData: string) => void;
  onSkip: () => void;
}

const CameraCapture = ({ voterName, onPhotoTaken, onSkip }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Por favor permite el acceso.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Take the photo
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const photoData = canvas.toDataURL("image/jpeg", 0.8);
          stopCamera();
          onPhotoTaken(photoData);
        }
      }
      setCountdown(null);
    }
  }, [countdown, onPhotoTaken]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl mx-4">
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-display font-bold mb-2">📸 ¡Sonríe, {voterName}!</h2>
            <p className="text-muted-foreground">
              Tómate una foto para aparecer si ganas una categoría
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-black mb-6">
            {error ? (
              <div className="aspect-video flex items-center justify-center bg-muted/20">
                <div className="text-center p-6">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={startCamera} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Intentar de nuevo
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover mirror"
                />
                {countdown !== null && countdown > 0 && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50"
                  >
                    <span className="text-9xl font-display font-bold text-white">
                      {countdown}
                    </span>
                  </motion.div>
                )}
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3 justify-center">
            <Button
              onClick={capturePhoto}
              disabled={!!error || countdown !== null}
              size="lg"
              className="gap-2"
            >
              <Camera className="w-5 h-5" />
              Tomar Foto
            </Button>
            <Button onClick={onSkip} variant="outline" size="lg" className="gap-2">
              <X className="w-5 h-5" />
              Omitir
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            La foto solo se guardará en tu navegador
          </p>
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </motion.div>
  );
};

export default CameraCapture;
