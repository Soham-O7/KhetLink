"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import "./KhetLinkCarousel.css";

const images = Array.from(
  { length: 12 },
  (_, i) => `/Carousel${i + 1}.jpeg`
);

export default function KhetLinkCarousel() {
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const positionRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  /*
   * Duplicate the images so the end can seamlessly
   * continue into the beginning.
   */
  const carouselImages = [
    ...images,
    ...images,
  ];

  /*
   * Continuous movement speed.
   * Smaller value = slower movement.
   */
  const SPEED = 35;

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta =
        (time - lastTimeRef.current) / 1000;

      lastTimeRef.current = time;

      if (!isHovered && trackRef.current) {
        positionRef.current += SPEED * delta;

        const track = trackRef.current;

        const firstSlide =
          track.children[0] as HTMLElement;

        if (firstSlide) {
          const slideWidth =
            firstSlide.offsetWidth;

          const styles =
            window.getComputedStyle(track);

          const gap =
            parseFloat(styles.gap) || 0;

          /*
           * Width of one complete image cycle.
           */
          const cycleWidth =
            (slideWidth + gap) * images.length;

          if (
            positionRef.current >=
            cycleWidth
          ) {
            positionRef.current -= cycleWidth;
          }
        }

        track.style.transform =
          `translate3d(-${positionRef.current}px, 0, 0)`;
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      lastTimeRef.current = null;
    };
  }, [isHovered]);


  /*
   * Manual movement.
   */
  const moveManually = (direction: "next" | "prev") => {
    if (!trackRef.current) return;

    const track = trackRef.current;

    const firstSlide =
      track.children[0] as HTMLElement;

    if (!firstSlide) return;

    const styles =
      window.getComputedStyle(track);

    const gap =
      parseFloat(styles.gap) || 0;

    const slideWidth =
      firstSlide.offsetWidth;

    const step =
      slideWidth + gap;

    const cycleWidth =
      step * images.length;

    if (direction === "next") {
      positionRef.current += step;
    } else {
      positionRef.current -= step;
    }

    /*
     * Keep position inside one complete cycle.
     */
    if (
      positionRef.current >=
      cycleWidth
    ) {
      positionRef.current -= cycleWidth;
    }

    if (positionRef.current < 0) {
      positionRef.current += cycleWidth;
    }

    track.style.transition =
      "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

    track.style.transform =
      `translate3d(-${positionRef.current}px, 0, 0)`;

    window.setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition =
          "none";
      }
    }, 600);
  };


  return (
    <section
      id="Gallery"
      className="khetlink-carousel"
    >

      <div className="khetlink-carousel-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="khetlink-carousel-header">
          <h2>
            From{" "}
            <strong>Farm</strong>{" "}
            to Destination
          </h2>

          <div className="khetlink-carousel-line" />

          <p>
            A glimpse into the farmers, produce and
            logistics behind KhetLink.
          </p>

        </div>


        {/* =================================================
            CAROUSEL
        ================================================= */}

        <div
          className="khetlink-carousel-box"

          onMouseEnter={() => {
            setIsHovered(true);

            lastTimeRef.current = null;
          }}

          onMouseLeave={() => {
            setIsHovered(false);

            lastTimeRef.current = null;
          }}
        >

          {/* LEFT */}

          <button
            type="button"
            className="khetlink-carousel-arrow left"
            onClick={() =>
              moveManually("prev")
            }
            aria-label="Previous image"
          >
            <ArrowLeft size={19} />
          </button>


          {/* IMAGE VIEWPORT */}

          <div className="khetlink-carousel-viewport">

            <div
              ref={trackRef}
              className="khetlink-carousel-track"
            >

              {carouselImages.map(
                (image, index) => (

                  <div
                    className="khetlink-carousel-slide"
                    key={`${image}-${index}`}
                  >

                    <img
                      src={image}
                      alt={`KhetLink gallery ${(
                        index %
                        images.length
                      ) + 1}`}
                      className="khetlink-carousel-image"
                    />

                  </div>

                )
              )}

            </div>

          </div>


          {/* RIGHT */}

          <button
            type="button"
            className="khetlink-carousel-arrow right"
            onClick={() =>
              moveManually("next")
            }
            aria-label="Next image"
          >
            <ArrowRight size={19} />
          </button>


          {/* LABEL */}

          <div className="khetlink-carousel-overlay">

            <span>
              {isHovered
                ? "Paused"
                : "KhetLink Gallery"}
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}