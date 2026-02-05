 import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
 import { useRef, useEffect } from 'react';
 
 const stats = [
   { value: 50000, suffix: '+', label: 'Active Researchers', description: 'Growing community worldwide' },
   { value: 2.5, suffix: 'M', label: 'Research Papers', description: 'Indexed and searchable' },
   { value: 180, suffix: '+', label: 'Countries', description: 'Global research network' },
   { value: 99.9, suffix: '%', label: 'Uptime', description: 'Enterprise reliability' },
 ];
 
 export const StatsSection = () => {
   return (
     <section className="relative py-24">
       {/* Wave divider top */}
       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
       
       <div className="container mx-auto px-6">
         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, index) => (
             <StatCard key={stat.label} stat={stat} index={index} />
           ))}
         </div>
       </div>
 
       {/* Wave divider bottom */}
       <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
     </section>
   );
 };
 
 interface StatCardProps {
   stat: {
     value: number;
     suffix: string;
     label: string;
     description: string;
   };
   index: number;
 }
 
 const StatCard = ({ stat, index }: StatCardProps) => {
   const ref = useRef<HTMLDivElement>(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });
 
   return (
     <motion.div
       ref={ref}
       initial={{ opacity: 0, y: 30 }}
       animate={isInView ? { opacity: 1, y: 0 } : {}}
       transition={{ duration: 0.5, delay: index * 0.15 }}
       className="relative text-center glass rounded-2xl p-8 group"
     >
       {/* Background glow */}
       <div className="absolute inset-0 rounded-2xl bg-gradient-radial from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
       
       {/* Number */}
       <div className="relative mb-2">
         <AnimatedCounter 
           value={stat.value} 
           suffix={stat.suffix} 
           isInView={isInView} 
         />
         {/* Underline glow pulse */}
         <motion.div
           className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-secondary"
           initial={{ opacity: 0, scale: 0.5 }}
           animate={isInView ? { opacity: 1, scale: 1 } : {}}
           transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
         />
         <motion.div
           className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-primary/30 blur-md"
           animate={{ opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
         />
       </div>
 
       <h3 className="text-lg font-semibold text-foreground mt-4 mb-1">
         {stat.label}
       </h3>
       <p className="text-sm text-muted-foreground">
         {stat.description}
       </p>
 
       {/* Particle spark effect */}
       <ParticleSpark isInView={isInView} delay={index * 0.15 + 0.8} />
     </motion.div>
   );
 };
 
 interface AnimatedCounterProps {
   value: number;
   suffix: string;
   isInView: boolean;
 }
 
 const AnimatedCounter = ({ value, suffix, isInView }: AnimatedCounterProps) => {
   const count = useMotionValue(0);
   const spring = useSpring(count, { duration: 2000, bounce: 0 });
   const ref = useRef<HTMLSpanElement>(null);
 
   useEffect(() => {
     if (isInView) {
       count.set(value);
     }
   }, [isInView, value, count]);
 
   useEffect(() => {
     const unsubscribe = spring.on('change', (latest) => {
       if (ref.current) {
         // Format number appropriately
         if (value >= 1000) {
           ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
         } else if (value % 1 !== 0) {
           ref.current.textContent = latest.toFixed(1) + suffix;
         } else {
           ref.current.textContent = Math.floor(latest) + suffix;
         }
       }
     });
     return unsubscribe;
   }, [spring, suffix, value]);
 
   return (
     <span 
       ref={ref} 
       className="text-4xl lg:text-5xl font-bold gradient-text"
     >
       0{suffix}
     </span>
   );
 };
 
 const ParticleSpark = ({ isInView, delay }: { isInView: boolean; delay: number }) => {
   const particles = Array.from({ length: 6 }, (_, i) => ({
     id: i,
     angle: (i / 6) * 360,
   }));
 
   return (
     <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
       {particles.map((particle) => (
         <motion.div
           key={particle.id}
           className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-primary"
           initial={{ 
             scale: 0, 
             x: 0, 
             y: 0,
             opacity: 0,
           }}
           animate={isInView ? {
             scale: [0, 1, 0],
             x: [0, Math.cos(particle.angle * Math.PI / 180) * 50],
             y: [0, Math.sin(particle.angle * Math.PI / 180) * 50],
             opacity: [0, 1, 0],
           } : {}}
           transition={{
             duration: 0.6,
             delay: delay,
             ease: "easeOut",
           }}
           style={{
             boxShadow: '0 0 6px hsl(191 100% 62%)',
           }}
         />
       ))}
     </div>
   );
 };