 import { useEffect, useRef, memo } from 'react';
 import { motion } from 'framer-motion';
 
 interface Star {
   id: number;
   x: number;
   y: number;
   size: number;
   opacity: number;
   animationDuration: number;
   animationDelay: number;
 }
 
 interface ShootingStar {
   id: number;
   startX: number;
   startY: number;
   duration: number;
   delay: number;
 }
 
 const generateStars = (count: number): Star[] => {
   return Array.from({ length: count }, (_, i) => ({
     id: i,
     x: Math.random() * 100,
     y: Math.random() * 100,
     size: Math.random() * 2 + 0.5,
     opacity: Math.random() * 0.7 + 0.3,
     animationDuration: Math.random() * 3 + 2,
     animationDelay: Math.random() * 5,
   }));
 };
 
 const generateShootingStars = (count: number): ShootingStar[] => {
   return Array.from({ length: count }, (_, i) => ({
     id: i,
     startX: Math.random() * 60,
     startY: Math.random() * 40,
     duration: Math.random() * 2 + 2,
     delay: Math.random() * 15 + i * 5,
   }));
 };
 
 const StarFieldComponent = () => {
   const stars = useRef<Star[]>(generateStars(150));
   const shootingStars = useRef<ShootingStar[]>(generateShootingStars(5));
 
   return (
     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
       {/* Static gradient background */}
       <div className="absolute inset-0 bg-gradient-space" />
       
       {/* Grid overlay */}
       <div className="absolute inset-0 grid-overlay opacity-30" />
       
       {/* Radial gradient for depth */}
       <div 
         className="absolute inset-0 opacity-60"
         style={{
           background: 'radial-gradient(ellipse at 50% 0%, hsl(223 100% 64% / 0.15) 0%, transparent 50%)',
         }}
       />
       
       {/* Nebula accent */}
       <div 
         className="absolute top-1/4 right-0 w-1/2 h-1/2 opacity-20 blur-3xl"
         style={{
           background: 'radial-gradient(circle, hsl(260 60% 55% / 0.4) 0%, transparent 70%)',
         }}
       />
       
       {/* Stars */}
       <svg className="absolute inset-0 w-full h-full">
         {stars.current.map((star) => (
           <motion.circle
             key={star.id}
             cx={`${star.x}%`}
             cy={`${star.y}%`}
             r={star.size}
             fill="hsl(210 40% 98%)"
             initial={{ opacity: star.opacity * 0.3 }}
             animate={{ 
               opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
               scale: [1, 1.2, 1],
             }}
             transition={{
               duration: star.animationDuration,
               delay: star.animationDelay,
               repeat: Infinity,
               ease: "easeInOut",
             }}
           />
         ))}
       </svg>
       
       {/* Shooting stars */}
       {shootingStars.current.map((shootingStar) => (
         <ShootingStarElement key={shootingStar.id} star={shootingStar} />
       ))}
       
       {/* Floating dust particles */}
       <FloatingParticles />
     </div>
   );
 };
 
 const ShootingStarElement = memo(({ star }: { star: ShootingStar }) => {
   return (
     <motion.div
       className="absolute w-1 h-1 bg-star-white rounded-full"
       style={{
         left: `${star.startX}%`,
         top: `${star.startY}%`,
         boxShadow: '0 0 6px 2px hsl(191 100% 62% / 0.8), 0 0 12px 4px hsl(191 100% 62% / 0.4)',
       }}
       initial={{ 
         x: 0, 
         y: 0, 
         opacity: 0,
         scale: 0,
       }}
       animate={{ 
         x: [0, 300], 
         y: [0, 300], 
         opacity: [0, 1, 1, 0],
         scale: [0, 1, 1, 0],
       }}
       transition={{
         duration: star.duration,
         delay: star.delay,
         repeat: Infinity,
         repeatDelay: 10,
         ease: "linear",
       }}
     >
       {/* Tail */}
       <div 
         className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-[2px] origin-right"
         style={{
           background: 'linear-gradient(90deg, transparent 0%, hsl(191 100% 62% / 0.6) 100%)',
         }}
       />
     </motion.div>
   );
 });
 
 ShootingStarElement.displayName = 'ShootingStarElement';
 
 const FloatingParticles = memo(() => {
   const particles = useRef(
     Array.from({ length: 30 }, (_, i) => ({
       id: i,
       x: Math.random() * 100,
       y: Math.random() * 100,
       size: Math.random() * 3 + 1,
       duration: Math.random() * 20 + 20,
       delay: Math.random() * 10,
     }))
   );
 
   return (
     <>
       {particles.current.map((particle) => (
         <motion.div
           key={particle.id}
           className="absolute rounded-full"
           style={{
             left: `${particle.x}%`,
             top: `${particle.y}%`,
             width: particle.size,
             height: particle.size,
             background: 'hsl(191 100% 62% / 0.3)',
             boxShadow: '0 0 4px hsl(191 100% 62% / 0.5)',
           }}
           animate={{
             y: [0, -30, 0],
             x: [0, 15, 0],
             opacity: [0.2, 0.5, 0.2],
           }}
           transition={{
             duration: particle.duration,
             delay: particle.delay,
             repeat: Infinity,
             ease: "easeInOut",
           }}
         />
       ))}
     </>
   );
 });
 
 FloatingParticles.displayName = 'FloatingParticles';
 
 export const StarField = memo(StarFieldComponent);