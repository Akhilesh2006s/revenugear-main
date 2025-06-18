"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, PerspectiveCamera } from "@react-three/drei"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import type { Group } from "three"
// import useSound from "use-sound"

interface RotatingModelProps {
  scrollY: number
}

function RotatingModel({ scrollY }: RotatingModelProps) {
  const modelRef = useRef<Group>(null)
  const { scene } = useGLTF("12.glb")

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollY * 0.005
      modelRef.current.rotation.x = Math.sin(scrollY * 0.003) * 0.1
    }
  })

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: any) => {
            material.transparent = true
            material.opacity = 0.25
          })
        } else {
          child.material.transparent = true
          child.material.opacity = 0.5
        }
      }
    })
  }, [scene])

  return (
    <group ref={modelRef} scale={[1, 1, 1]} position={[0, -1.8, 0]}>
      <primitive object={scene} />
    </group>
  )
}

interface SceneProps {
  scrollY: number
}

function Scene({ scrollY }: SceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.6} />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} />
      <RotatingModel scrollY={scrollY} />
      <Environment preset="city" />
    </>
  )
}

const FlyText = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  flyDirection = "up",
  flyDistance = 100,
  scale = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  threshold?: number
  flyDirection?: "up" | "down" | "left" | "right"
  flyDistance?: number
  scale?: boolean
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: false,
    margin: `-${threshold * 100}% 0px -${threshold * 100}% 0px`,
  })

  let initialX = 0
  let initialY = 0
  let exitX = 0
  let exitY = 0

  switch (flyDirection) {
    case "up":
      initialY = flyDistance
      exitY = -flyDistance
      break
    case "down":
      initialY = -flyDistance
      exitY = flyDistance
      break
    case "left":
      initialX = flyDistance
      exitX = -flyDistance
      break
    case "right":
      initialX = -flyDistance
      exitX = flyDistance
      break
  }

  return (
    <div ref={ref} className="overflow-visible">
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{
              opacity: 0,
              x: initialX,
              y: initialY,
              scale: scale ? 0.5 : 1,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: exitX,
              y: exitY,
              scale: scale ? 0.5 : 1,
              transition: {
                duration: duration * 0.8,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StaggeredFlyText = ({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
  flyDirection = "up",
  flyDistance = 50,
  exitDelay = 0,
}: {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  flyDirection?: "up" | "down" | "left" | "right"
  flyDistance?: number
  exitDelay?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" })
  const letters = text.split("")

  let initialX = 0
  let initialY = 0
  let exitX = 0
  let exitY = 0

  switch (flyDirection) {
    case "up":
      initialY = flyDistance
      exitY = -flyDistance
      break
    case "down":
      initialY = -flyDistance
      exitY = flyDistance
      break
    case "left":
      initialX = flyDistance
      exitX = -flyDistance
      break
    case "right":
      initialX = -flyDistance
      exitX = flyDistance
      break
  }

  return (
    <div ref={ref} className={className}>
      <AnimatePresence>
        {isInView && (
          <div className="inline-block">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  x: initialX,
                  y: initialY,
                  scale: 0.5,
                  rotateX: flyDirection === "up" || flyDirection === "down" ? -30 : 0,
                  rotateY: flyDirection === "left" || flyDirection === "right" ? -30 : 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  rotateY: 0,
                }}
                exit={{
                  opacity: 0,
                  x: exitX,
                  y: exitY,
                  scale: 0.5,
                  rotateX: flyDirection === "up" || flyDirection === "down" ? 30 : 0,
                  rotateY: flyDirection === "left" || flyDirection === "right" ? 30 : 0,
                  transition: {
                    duration: 0.5,
                    delay: exitDelay + (letters.length - index) * staggerDelay * 0.5,
                    ease: [0.32, 0.72, 0, 1],
                  },
                }}
                transition={{
                  duration: 0.6,
                  delay: delay + index * staggerDelay,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="inline-block"
                style={{
                  transformOrigin: "center center",
                  display: "inline-block",
                  whiteSpace: "pre",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StatisticHighlight = ({
  number,
  text,
  delay = 0,
}: {
  number: string
  text: string
  delay?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" })

  return (
    <div ref={ref} className="flex flex-col items-center justify-center">
      <AnimatePresence>
        {isInView && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -100 }}
              transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="relative"
            >
              <span className="text-[12rem] md:text-[16rem] font-bold text-[#006C67] leading-none tracking-tight">
                {number}
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: delay + 0.3, duration: 0.5 }}
                className="absolute -top-4 -right-4 text-6xl text-[#006F74]"
              >
                %
              </motion.span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{
                duration: 0.6,
                delay: delay + 0.4,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="text-2xl md:text-3xl text-[#4B9C99] mt-6 max-w-2xl text-center font-light"
            >
              {text}
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const GlareCard = ({
  title,
  icon,
  desc,
  delay = 0,
  direction = "up",
}: {
  title: string
  icon: string
  desc: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
  }

  return (
    <FlyText delay={delay} flyDirection={direction} flyDistance={120}>
      <motion.div
        ref={cardRef}
        className="relative p-8 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden group cursor-pointer"
        onMouseMove={handleMouseMove}
        whileHover={{
          y: -10,
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0, 108, 103, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />

        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 100%",
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="text-6xl mb-6 text-center"
            whileHover={{
              scale: 1.2,
              rotate: [0, -5, 5, -5, 0],
              y: -5,
            }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {icon}
          </motion.div>

          <StaggeredFlyText
            text={title}
            className="text-xl font-bold text-[#006C67] mb-4 text-center leading-tight font-['Poppins',sans-serif]"
            flyDirection="up"
            staggerDelay={0.02}
          />

          <FlyText delay={0.3} flyDirection="up">
            <p className="text-[#4B9C99] text-center leading-relaxed font-light font-['Poppins',sans-serif] group-hover:text-[#006F74] transition-colors duration-300">
              {desc}
            </p>
          </FlyText>

          <motion.div
            className="w-0 h-0.5 bg-[#006C67] mx-auto mt-6 group-hover:w-16 transition-all duration-500 rounded-full"
            initial={{ width: 0 }}
            whileHover={{ width: "4rem" }}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [-10, -25, -10],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      </motion.div>
    </FlyText>
  )
}

export default function Component() {
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  const [scrollDirection, setScrollDirection] = useState("up")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [audioAllowed, setAudioAllowed] = useState(false)

  // Initialize audio
  // const [play, { stop }] = useSound("/1.mp3", {
  //   loop: true,
  //   volume: 0.5,
  //   interrupt: true,
  // })

  // Video ref for hidden video element
  const videoRef = useRef<HTMLVideoElement>(null)

  // Model opacity, scale, and blur based on scroll
  const modelOpacity = useTransform(scrollYProgress, [0.7, 0.8], [1, 0])
  const modelScale = useTransform(scrollYProgress, [0.7, 0.8], [1, 0.3])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up")
      }

      setLastScrollY(currentScrollY)
      setScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Handle audio permission and autoplay
  useEffect(() => {
    // Try to play audio when user interacts with the page
    const handleUserInteraction = () => {
      if (!audioAllowed) {
        setAudioAllowed(true)
        if (videoRef.current) {
          videoRef.current.play()
        }
        document.removeEventListener("click", handleUserInteraction)
        document.removeEventListener("scroll", handleUserInteraction)
      }
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("scroll", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("scroll", handleUserInteraction)
    }
  }, [audioAllowed])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.play()
        videoRef.current.muted = false
      } else {
        videoRef.current.pause()
        videoRef.current.muted = true
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#E6F6F7]">
      {/* Hidden Video for Audio */}
      <video
        ref={videoRef}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        style={{ display: "none" }}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.volume = 0.5
          }
        }}
      >
        <source src="/4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Audio Control Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#006C67] text-white flex items-center justify-center shadow-lg"
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </motion.button>

      {/* Navigation Header */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-2 md:p-3 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: 1,
          y: scrollDirection === "down" ? -100 : 0,
        }}
        transition={{
          duration: scrollDirection === "down" ? 0.3 : 0.6,
          delay: scrollDirection === "down" ? 0 : 0.1,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
            whileHover={{
              rotate: 360,
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0, 108, 103, 0.2)",
            }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo1.png" alt="Revenue Gear Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          </motion.div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-lg md:text-xl font-bold text-[#006C67] tracking-wide font-['Poppins',sans-serif]">
              Revenue Gear
            </h1>
            <p className="text-xs text-[#4B9C99] font-light">AI-Powered Intelligence</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://revlabs.tech/#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#006C67] to-[#006F74] text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:from-[#006F74] hover:to-[#005A5F] transition-all duration-300 font-semibold tracking-wide font-['Poppins',sans-serif] shadow-xl text-xs md:text-sm relative overflow-hidden group"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 108, 103, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Contact Us</span>
              <motion.svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </span>

            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
      </motion.nav>

      {/* 3D Model Section */}
      <motion.div
        className="fixed inset-0 w-full h-full"
        style={{
          opacity: modelOpacity,
          scale: modelScale,
        }}
      >
        <Canvas className="w-full h-full">
          <Scene scrollY={scrollY} />
        </Canvas>
      </motion.div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Welcome Section */}
        <div className="h-screen flex flex-col items-center justify-start pt-20 px-8">
          <div className="text-center mb-8">
            <div className="mb-8 overflow-hidden">
              <StaggeredFlyText
                text="WELCOME TO"
                className="text-6xl md:text-8xl font-light text-[#006C67] tracking-wider leading-tight
                   hover:text-[#006F74] transition-all duration-700 ease-out cursor-default
                   hover:tracking-widest transform hover:scale-105
                   font-['Space_Grotesk',sans-serif] antialiased"
                flyDirection="left"
                flyDistance={100}
              />
            </div>
            <div className="relative overflow-hidden">
              <StaggeredFlyText
                text="REVENUE GEAR"
                className="text-5xl md:text-7xl font-semibold text-[#006C67] tracking-wider leading-tight
                   hover:text-[#006F74] transition-all duration-700 ease-out cursor-default
                   hover:tracking-widest transform hover:scale-105
                   font-['Playfair_Display',serif] antialiased"
                delay={0.5}
                flyDirection="right"
                flyDistance={100}
              />
              <motion.div
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-[#4B9C99]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 1, delay: 2 }}
              />
            </div>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            }}
          >
            <motion.div
              className="flex flex-col items-center space-y-3"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <FlyText delay={2.5} flyDirection="down">
                <span className="text-[#4B9C99] text-sm font-light tracking-widest uppercase font-['Poppins',sans-serif]">
                  Scroll
                </span>
              </FlyText>
              <div className="w-px h-16 bg-[#4B9C99] animate-pulse"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Statistic Section */}
        <div className="h-screen flex flex-col items-center justify-center px-8">
          <StatisticHighlight number="95" text="" />
          <motion.button
            className="bg-[#006C67] text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-['Poppins',sans-serif] hover:bg-[#006F74]"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 108, 103, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            of customer calls at a vehicle dealership are never reviewed. That's why customers leave silently.{" "}
          </motion.button>
        </div>

        {/* Big Paragraph Section */}
        <div className="h-screen flex flex-col items-center justify-center px-8">
          <FlyText className="text-center max-w-6xl px-4" flyDirection="up" flyDistance={100} duration={1.2}>
            <h2 className="text-4xl md:text-5xl font-light text-[#006C67] mb-12 tracking-wide font-['Poppins',sans-serif]">
              The <span className="font-semibold text-[#006F74]">Future</span> AI-powered service intelligence
            </h2>
            <div className="mt-12 flex justify-center">
              <div className="w-32 h-px bg-[#4B9C99]"></div>
            </div>
          </FlyText>
        </div>

        {/* Final Transition */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl px-8">
            <FlyText flyDirection="down" flyDistance={150}>
              <h2 className="text-5xl md:text-6xl font-light text-[#006C67] mb-8 tracking-wide font-['Poppins',sans-serif]">
                Experience the <span className="font-semibold text-[#006F74]">Difference</span>
              </h2>
            </FlyText>
            <FlyText delay={0.4} flyDirection="up" flyDistance={150}>
              <p className="text-xl text-[#4B9C99] leading-relaxed font-light font-['Poppins',sans-serif]">
                Customers are signaling churn, missed appointments, poor service, repeat issues — All revenue leak
                signals! RevenueGear captures 100% of customer voice & revenue leak signals so your team can act before
                the revenue goes away.{" "}
              </p>
            </FlyText>
          </div>
        </div>
      </div>
    </div>
  )
}
