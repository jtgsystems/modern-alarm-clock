"use client"

// 2025 Modern Animation Patterns with Framer Motion
import { motion, type Variants, type Transition } from 'framer-motion'

// 2025 Modern Animation Presets
export const modernTransitions = {
  // 2025 Trend: Spring animations with natural physics
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 120,
    mass: 0.8
  } as Transition,

  // 2025 Trend: Smooth easing curves
  smooth: {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.4
  } as Transition,

  // 2025 Trend: Bouncy interactions
  bouncy: {
    type: "spring",
    damping: 10,
    stiffness: 400,
    mass: 0.5
  } as Transition,

  // 2025 Trend: Slow reveal for important content
  reveal: {
    type: "tween",
    ease: "easeOut",
    duration: 0.8
  } as Transition,

  // 2025 Trend: Quick micro-interactions
  micro: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.15
  } as Transition
}

// 2025 Modern Animation Variants
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: modernTransitions.spring
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: modernTransitions.smooth
  }
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: modernTransitions.bouncy
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(2px)",
    transition: modernTransitions.smooth
  }
}

export const slideInFromSide: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    rotateY: -15
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: modernTransitions.spring
  },
  exit: {
    opacity: 0,
    x: 60,
    rotateY: 15,
    transition: modernTransitions.smooth
  }
}

export const morphIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
    borderRadius: "50%",
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    borderRadius: "0%",
    rotate: 0,
    transition: modernTransitions.spring
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    borderRadius: "25%",
    rotate: 90,
    transition: modernTransitions.smooth
  }
}

// 2025 Trend: Staggered animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: modernTransitions.spring
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: modernTransitions.micro
  }
}

// 2025 Modern Hover Animations
export const modernHover = {
  scale: 1.02,
  transition: modernTransitions.micro
}

export const pressAnimation = {
  scale: 0.98,
  transition: modernTransitions.micro
}

// 2025 Modern Loading Animation
export const loadingDots: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// 2025 Modern Pulse Animation for notifications
export const pulseRing: Variants = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.8, 0, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}

// 2025 Floating Animation for hero elements
export const floating: Variants = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// 2025 Modern Number Counter Animation
export const numberCounter = {
  initial: { scale: 1, rotateX: 0 },
  animate: {
    scale: [1, 1.1, 1],
    rotateX: [0, 180, 360],
    transition: modernTransitions.spring
  }
}

// 2025 Modern Glass Card Animation
export const glassCard: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    background: "rgba(255, 255, 255, 0)"
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.1)",
    transition: modernTransitions.reveal
  },
  hover: {
    backdropFilter: "blur(30px)",
    background: "rgba(255, 255, 255, 0.15)",
    scale: 1.01,
    transition: modernTransitions.micro
  }
}

// 2025 Modern Page Transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    clipPath: "circle(0% at 50% 50%)"
  },
  animate: {
    opacity: 1,
    clipPath: "circle(100% at 50% 50%)",
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    clipPath: "circle(0% at 50% 50%)",
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}

// 2025 Modern Component Wrappers
interface AnimatedWrapperProps {
  children: React.ReactNode
  variant?: keyof typeof animationVariants
  delay?: number
  className?: string
}

const animationVariants = {
  fadeInUp,
  scaleIn,
  slideInFromSide,
  morphIn,
  glassCard
}

export function AnimatedWrapper({
  children,
  variant = 'fadeInUp',
  delay = 0,
  className = ''
}: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={animationVariants[variant]}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 2025 Modern Stagger Container
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 2025 Modern Stagger Item
interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default {
  modernTransitions,
  fadeInUp,
  scaleIn,
  slideInFromSide,
  morphIn,
  staggerContainer,
  staggerItem,
  modernHover,
  pressAnimation,
  loadingDots,
  pulseRing,
  floating,
  numberCounter,
  glassCard,
  pageTransition,
  AnimatedWrapper,
  StaggerContainer,
  StaggerItem
}