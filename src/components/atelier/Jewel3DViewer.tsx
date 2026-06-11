/**
 * Viewer 3D del gioiello — vanilla Three.js + GLTFLoader + OrbitControls.
 * Sostituisce <model-viewer> per garantire rendering affidabile dell'anteprima.
 * - Carica il GLB via GLTFLoader (URL pubblico fal.media, CORS aperto).
 * - Mostra stati espliciti: loading, error, ready.
 * - Auto-centratura del modello + auto-rotate finché l'utente non interagisce.
 */
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
};

export function Jewel3DViewer({ src, className }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mountRef.current) return;

    const mount = mountRef.current;
    let renderer: import("three").WebGLRenderer | null = null;
    let frameId: number | null = null;
    let resizeObs: ResizeObserver | null = null;
    let disposed = false;
    let userInteracted = false;

    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

        if (disposed) return;

        const width = mount.clientWidth || 800;
        const height = mount.clientHeight || 600;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.01, 1000);
        camera.position.set(0, 0, 2.5);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        // Environment (per riflessi metallici)
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

        // Lights di rinforzo
        const key = new THREE.DirectionalLight(0xffffff, 1.2);
        key.position.set(2, 3, 4);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xffe9c4, 0.5);
        fill.position.set(-3, 1, -2);
        scene.add(fill);
        scene.add(new THREE.AmbientLight(0xffffff, 0.25));

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 0.3;
        controls.maxDistance = 10;
        controls.target.set(0, 0, 0);
        controls.addEventListener("start", () => {
          userInteracted = true;
        });

        // Loader GLB
        const loader = new GLTFLoader();
        loader.load(
          src,
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;

            // Centra e ridimensiona il modello in un volume unitario
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 1.4 / maxDim;
            model.position.sub(center.multiplyScalar(scale));
            model.scale.setScalar(scale);

            scene.add(model);

            // Camera framing
            camera.position.set(1.6, 1.1, 2.2);
            controls.target.set(0, 0, 0);
            controls.update();

            setStatus("ready");
          },
          undefined,
          (err) => {
            console.error("[Jewel3DViewer] GLTF load error:", err);
            setErrorMsg("Impossibile caricare il modello 3D.");
            setStatus("error");
          },
        );

        const animate = () => {
          if (disposed) return;
          frameId = requestAnimationFrame(animate);
          if (!userInteracted) {
            scene.rotation.y += 0.003;
          }
          controls.update();
          renderer!.render(scene, camera);
        };
        animate();

        // Resize
        resizeObs = new ResizeObserver(() => {
          if (!renderer) return;
          const w = mount.clientWidth || 800;
          const h = mount.clientHeight || 600;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        });
        resizeObs.observe(mount);
      } catch (e) {
        console.error("[Jewel3DViewer] init error:", e);
        setErrorMsg("Errore di inizializzazione del viewer 3D.");
        setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObs) resizeObs.disconnect();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, [src]);

  return (
    <div
      className={
        className ??
        "relative w-full rounded-2xl overflow-hidden"
      }
      style={{
        height: "min(80vh, 780px)",
        minHeight: "520px",
        background:
          "radial-gradient(60% 60% at 50% 40%, oklch(0.72 0.082 75 / 0.18) 0%, oklch(0.18 0.012 60) 70%)",
      }}
    >
      <div ref={mountRef} className="absolute inset-0" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-bone/70 text-xs uppercase tracking-[0.28em] pointer-events-none">
          Caricamento anteprima 3D…
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-red-200 text-sm px-6 text-center">
          <p>{errorMsg ?? "Errore nel caricamento del modello."}</p>
          <p className="text-bone/50 text-xs">Riprova la generazione 3D oppure scarica il file .glb.</p>
        </div>
      )}

      {status === "ready" && (
        <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.3em] text-bone/50">
          Trascina per ruotare · Scroll per zoom
        </div>
      )}
    </div>
  );
}
