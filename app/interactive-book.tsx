"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next")
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollTime = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const pages = [
    { title: "Page 1", image: "300.png" },
    { title: "Page 2", image: "301.png" },
    { title: "Page 3", image: "306.png" },
    { title: "Page 4", image: "200.png" },
    
  ]

  const handleScroll = (e: WheelEvent) => {
    e.preventDefault()

    const now = Date.now()
    if (now - lastScrollTime.current < 500 || isFlipping) return
    lastScrollTime.current = now

    if (e.deltaY > 0) {
      // Scroll down - next page
      if (currentPage < pages.length - 1) {
        setFlipDirection("next")
        setIsFlipping(true)
        setTimeout(() => {
          setCurrentPage((prev) => prev + 1)
          setTimeout(() => setIsFlipping(false), 300)
        }, 300)
      } else {
        // End of book - close and return to cover
        setIsFlipping(true)
        setTimeout(() => {
          setIsOpen(false)
          setCurrentPage(0)
          setIsFlipping(false)
        }, 500)
      }
    } else {
      // Scroll up - previous page
      if (currentPage > 0) {
        setFlipDirection("prev")
        setIsFlipping(true)
        setTimeout(() => {
          setCurrentPage((prev) => prev - 1)
          setTimeout(() => setIsFlipping(false), 300)
        }, 300)
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      const bookElement = document.getElementById("book-container")
      if (bookElement) {
        bookElement.addEventListener("wheel", handleScroll, { passive: false })
        return () => bookElement.removeEventListener("wheel", handleScroll)
      }
    }
  }, [isOpen, currentPage, isFlipping])

  const openBook = () => {
    // Play sound effect
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }
    setIsOpen(true)
    setCurrentPage(0)
  }

  const closeBook = () => {
    setIsOpen(false)
    setCurrentPage(0)
  }

  return (
<div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#006C67] via-[#006F74] to-[#006C67] p-20 pt-32">
      {/* Animated Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse-glow font-serif tracking-wider drop-shadow-2xl">
          THE COMIC STORY
        </h1>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>

      <div className="relative">
        {!isOpen ? (
          // Closed Book with Photo Cover - Tilted to the left
          <div
            className="cursor-pointer transform perspective-1000 transition-all duration-500 hover:scale-105"
            onClick={openBook}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: isHovered ? "rotateZ(-25deg) rotateY(10deg) scale(1.05)" : "rotateZ(-15deg)",
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
<Card className="w-[500px] h-[600px] shadow-2xl relative overflow-hidden border-4 border-amber-700 bg-black">
              <div className="absolute inset-0">
                <img src="COVER.jpg" alt="Photo Book Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
              </div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-white">
                <div className="text-amber-300 text-sm bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
                  Click to explore • Scroll to turn pages
                </div>
              </div>
              <div className="absolute right-0 top-0 w-3 h-full bg-gradient-to-l from-amber-900 to-amber-700 shadow-inner"></div>
              <div className="absolute right-3 top-0 w-1 h-full bg-amber-600"></div>
            </Card>
          </div>
        ) : (
          // Open Book with Page Turning Animation
          <div id="book-container" className="relative cursor-grab active:cursor-grabbing">
            <Card className="w-[900px] h-[600px] bg-white shadow-2xl relative overflow-hidden">
              {/* Book Binding */}
              <div className="absolute left-1/2 top-0 w-2 h-full bg-amber-800 transform -translate-x-1/2 z-20 shadow-lg"></div>

              {/* Current Page Spread */}
              <div className="absolute inset-0 flex">
                {/* Left Page */}
                <div className="w-1/2 h-full flex items-center justify-center border-r border-amber-200 relative overflow-hidden">
                  {currentPage > 0 && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${pages[currentPage - 1]?.image || "/placeholder.svg"})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </>
                  )}
                </div>

                {/* Right Page */}
                <div className="w-1/2 h-full flex items-center justify-center relative overflow-hidden">
                  {currentPage < pages.length && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${pages[currentPage]?.image || "/placeholder.svg"})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </>
                  )}
                </div>
              </div>

              {/* Page Turning Animation Overlay */}
              {isFlipping && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {flipDirection === "next" ? (
                    <div className="absolute right-0 top-0 w-1/2 h-full origin-left animate-flip-next shadow-2xl relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-x-[-1]"
                        style={{
                          backgroundImage: `url(${pages[currentPage]?.image || "/placeholder.svg"})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ) : (
                    <div className="absolute left-0 top-0 w-1/2 h-full origin-right animate-flip-prev shadow-2xl relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${pages[currentPage - 1]?.image || "/placeholder.svg"})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  )}
                </div>
              )}

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 z-30">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                ></div>
              </div>
            </Card>

            {/* Instructions */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white/70 text-sm">Scroll down for next page • Scroll up for previous page</p>
              <p className="text-white/50 text-xs mt-1">
                Page {currentPage + 1} of {pages.length}
              </p>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeBook}
              className="absolute -top-12 -right-12 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg z-30"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Audio element for book opening sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/book.mp4" type="audio/mp4" />
        <source src="/book.m4a" type="audio/mp4" />
      </audio>

      <style jsx global>{`
        @keyframes flip-next {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateY(-90deg);
            opacity: 0.7;
          }
          100% {
            transform: rotateY(-180deg);
            opacity: 0;
          }
        }
        
        @keyframes flip-prev {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateY(90deg);
            opacity: 0.7;
          }
          100% {
            transform: rotateY(180deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.5), 0 0 90px rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-flip-next {
          animation: flip-next 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-flip-prev {
          animation: flip-prev 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.5s both;
        }
        
        #book-container {
          perspective: 1200px;
        }
      `}</style>
    </div>
  )
}
