 import { motion } from 'framer-motion';
 import { ArrowRight, Sparkles } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useNavigate } from 'react-router-dom';
 
 export const CTASection = () => {
   const navigate = useNavigate();
   return (
     <section className="relative py-24 lg:py-32">
       <div className="container mx-auto px-6">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="relative max-w-4xl mx-auto text-center"
         >
           {/* Glowing card */}
           <div className="relative glass-strong rounded-3xl p-12 lg:p-16 overflow-hidden">
             {/* Background effects */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
             <div 
               className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full opacity-30 blur-3xl"
               style={{
                 background: 'radial-gradient(circle, hsl(191 100% 62% / 0.4) 0%, transparent 60%)',
               }}
             />
             
             {/* Grid overlay */}
             <div className="absolute inset-0 grid-overlay opacity-30 rounded-3xl" />
 
             {/* Content */}
             <div className="relative z-10">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
               >
                 <Sparkles className="w-4 h-4 text-primary" />
                 <span className="text-sm text-primary">Start Your Journey Today</span>
               </motion.div>
 
               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                 Ready to Transform
                 <br />
                 <span className="gradient-text-animated">Your Research?</span>
               </h2>
 
               <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                 Join over 50,000 researchers worldwide who are already using 
                 SochX to accelerate their discoveries.
               </p>
 
               <div className="flex flex-wrap justify-center gap-4">
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <Button 
                     size="lg"
                     className="btn-ripple bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-6 text-lg hover:shadow-lg hover:shadow-primary/25 transition-all group"
                     onClick={() => navigate('/auth/register')}
                   >
                     Get Started Free
                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </motion.div>
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <Button 
                     size="lg"
                     variant="outline"
                     className="glass border-glass-border text-foreground px-8 py-6 text-lg hover:border-primary/50 hover:bg-primary/5"
                     onClick={() => navigate('/auth/login')}
                   >
                     Schedule Demo
                   </Button>
                 </motion.div>
               </div>
 
               <p className="text-xs text-muted-foreground mt-6">
                 No credit card required • 14-day free trial • Cancel anytime
               </p>
             </div>
           </div>
         </motion.div>
       </div>
 
       {/* Floating particles */}
       <FloatingElements />
     </section>
   );
 };
 
 const FloatingElements = () => {
   const elements = [
     { size: 4, x: '10%', y: '20%', delay: 0 },
     { size: 6, x: '85%', y: '30%', delay: 1 },
     { size: 3, x: '15%', y: '70%', delay: 2 },
     { size: 5, x: '90%', y: '80%', delay: 0.5 },
   ];
 
   return (
     <>
       {elements.map((el, i) => (
         <motion.div
           key={i}
           className="absolute rounded-full bg-primary/30 pointer-events-none"
           style={{
             width: el.size,
             height: el.size,
             left: el.x,
             top: el.y,
             boxShadow: '0 0 10px hsl(191 100% 62% / 0.5)',
           }}
           animate={{
             y: [0, -20, 0],
             opacity: [0.3, 0.7, 0.3],
           }}
           transition={{
             duration: 4,
             delay: el.delay,
             repeat: Infinity,
             ease: "easeInOut",
           }}
         />
       ))}
     </>
   );
 };