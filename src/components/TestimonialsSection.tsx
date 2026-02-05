 import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
 import { useRef, useState, useEffect } from 'react';
 import { Quote } from 'lucide-react';
 
 const testimonials = [
   {
     id: 1,
     name: 'Dr. Sarah Chen',
     role: 'Neuroscience Researcher',
     institution: 'MIT',
     quote: 'SochX transformed how our lab collaborates. The AI-powered connections have led to three breakthrough papers.',
     avatar: 'SC',
   },
   {
     id: 2,
     name: 'Prof. James Miller',
     role: 'Climate Scientist',
     institution: 'Stanford',
     quote: 'The global network access is unparalleled. I connected with researchers I never would have found otherwise.',
     avatar: 'JM',
   },
   {
     id: 3,
     name: 'Dr. Aisha Patel',
     role: 'Biotech Lead',
     institution: 'Cambridge',
     quote: 'Publishing and peer review have never been smoother. SochX is the future of academic research.',
     avatar: 'AP',
   },
   {
     id: 4,
     name: 'Dr. Marcus Weber',
     role: 'Quantum Physics',
     institution: 'ETH Zurich',
     quote: 'The analytics dashboard gives unprecedented insight into research impact and citation trends.',
     avatar: 'MW',
   },
   {
     id: 5,
     name: 'Prof. Elena Rodriguez',
     role: 'AI Ethics',
     institution: 'Oxford',
     quote: 'Finally a platform that understands the needs of modern researchers. Absolutely essential.',
     avatar: 'ER',
   },
 ];
 
 export const TestimonialsSection = () => {
   const [activeIndex, setActiveIndex] = useState(2);
   const containerRef = useRef<HTMLDivElement>(null);
   const x = useMotionValue(0);
   const [isPaused, setIsPaused] = useState(false);
 
   // Auto-scroll
   useEffect(() => {
     if (isPaused) return;
     
     const interval = setInterval(() => {
       setActiveIndex((prev) => (prev + 1) % testimonials.length);
     }, 5000);
 
     return () => clearInterval(interval);
   }, [isPaused]);
 
   const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
     const threshold = 50;
     if (info.offset.x > threshold) {
       setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
     } else if (info.offset.x < -threshold) {
       setActiveIndex((prev) => (prev + 1) % testimonials.length);
     }
   };
 
   return (
     <section id="community" className="relative py-24 lg:py-32 overflow-hidden">
       {/* Background accent */}
       <div 
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 opacity-20 blur-3xl pointer-events-none"
         style={{
           background: 'radial-gradient(ellipse, hsl(260 60% 55% / 0.3) 0%, transparent 70%)',
         }}
       />
       
       <div className="container mx-auto px-6">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
         >
           <span className="inline-block px-4 py-2 rounded-full glass border border-accent/30 text-sm text-muted-foreground mb-4">
             Testimonials
           </span>
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
             Trusted by <span className="gradient-text">Leading Researchers</span>
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Join thousands of researchers who have transformed their workflow with SochX.
           </p>
         </motion.div>
 
         {/* Carousel */}
         <div 
           ref={containerRef}
           className="relative perspective-1000"
           onMouseEnter={() => setIsPaused(true)}
           onMouseLeave={() => setIsPaused(false)}
         >
           <motion.div
             drag="x"
             dragConstraints={{ left: 0, right: 0 }}
             dragElastic={0.1}
             onDragEnd={handleDragEnd}
             style={{ x }}
             className="flex items-center justify-center gap-6 py-8 cursor-grab active:cursor-grabbing"
           >
             {testimonials.map((testimonial, index) => (
               <TestimonialCard
                 key={testimonial.id}
                 testimonial={testimonial}
                 index={index}
                 activeIndex={activeIndex}
                 total={testimonials.length}
                 onClick={() => setActiveIndex(index)}
               />
             ))}
           </motion.div>
 
           {/* Navigation dots */}
           <div className="flex justify-center gap-2 mt-8">
             {testimonials.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setActiveIndex(index)}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
                   index === activeIndex 
                     ? 'w-8 bg-primary' 
                     : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                 }`}
               />
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 interface TestimonialCardProps {
   testimonial: {
     id: number;
     name: string;
     role: string;
     institution: string;
     quote: string;
     avatar: string;
   };
   index: number;
   activeIndex: number;
   total: number;
   onClick: () => void;
 }
 
 const TestimonialCard = ({ testimonial, index, activeIndex, total, onClick }: TestimonialCardProps) => {
   // Calculate position relative to active
   const getPosition = () => {
     let diff = index - activeIndex;
     if (diff > total / 2) diff -= total;
     if (diff < -total / 2) diff += total;
     return diff;
   };
 
   const position = getPosition();
   const isActive = position === 0;
   const isVisible = Math.abs(position) <= 2;
 
   if (!isVisible) return null;
 
   const xOffset = position * 320;
   const scale = isActive ? 1 : 0.85;
   const rotateY = position * -8;
   const opacity = isActive ? 1 : 0.6;
   const zIndex = isActive ? 10 : 5 - Math.abs(position);
   const blur = isActive ? 0 : 2;
 
   return (
     <motion.div
       onClick={onClick}
       animate={{
         x: xOffset,
         scale,
         rotateY,
         opacity,
         filter: `blur(${blur}px)`,
       }}
       transition={{ duration: 0.5, ease: "easeOut" }}
       className={`absolute w-80 glass-strong rounded-2xl p-6 cursor-pointer ${
         isActive ? 'glow-cyan' : ''
       }`}
       style={{ 
         zIndex,
         transformStyle: 'preserve-3d',
       }}
     >
       <Quote className="w-8 h-8 text-primary/30 mb-4" />
       
       <p className="text-foreground mb-6 leading-relaxed">
         "{testimonial.quote}"
       </p>
 
       <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
           {testimonial.avatar}
         </div>
         <div>
           <div className="font-semibold text-foreground">{testimonial.name}</div>
           <div className="text-sm text-muted-foreground">{testimonial.role}</div>
           <div className="text-xs text-primary">{testimonial.institution}</div>
         </div>
       </div>
     </motion.div>
   );
 };