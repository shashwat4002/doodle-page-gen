 import { motion, AnimatePresence } from 'framer-motion';
 import { useState, useEffect } from 'react';
 import { Bell, X, Users, TrendingUp, Award } from 'lucide-react';
 
 interface Notification {
   id: number;
   icon: React.ElementType;
   title: string;
   message: string;
 }
 
 const notifications: Notification[] = [
   { id: 1, icon: Users, title: 'New Collaborator', message: 'Dr. Chen joined your project' },
   { id: 2, icon: TrendingUp, title: 'Citation Alert', message: 'Your paper was cited 5 times' },
   { id: 3, icon: Award, title: 'Achievement', message: 'Reached 100 citations milestone' },
   { id: 4, icon: Bell, title: 'New Review', message: 'Peer review completed' },
 ];
 
 export const ToastNotification = () => {
   const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
   const [progress, setProgress] = useState(100);
 
   useEffect(() => {
     const showNotification = () => {
       const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
       setActiveNotification(randomNotification);
       setProgress(100);
 
       // Auto dismiss after 4 seconds
       const progressInterval = setInterval(() => {
         setProgress((prev) => {
           if (prev <= 0) {
             clearInterval(progressInterval);
             return 0;
           }
           return prev - 2;
         });
       }, 80);
 
       const dismissTimer = setTimeout(() => {
         setActiveNotification(null);
         clearInterval(progressInterval);
       }, 4000);
 
       return () => {
         clearTimeout(dismissTimer);
         clearInterval(progressInterval);
       };
     };
 
     // Initial delay
     const initialTimer = setTimeout(() => {
       showNotification();
     }, 5000);
 
     // Repeat interval
     const repeatInterval = setInterval(() => {
       showNotification();
     }, 15000);
 
     return () => {
       clearTimeout(initialTimer);
       clearInterval(repeatInterval);
     };
   }, []);
 
   const dismiss = () => {
     setActiveNotification(null);
   };
 
   return (
     <AnimatePresence>
       {activeNotification && (
         <motion.div
           initial={{ opacity: 0, x: 100, y: 0 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           exit={{ opacity: 0, x: 100 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="fixed bottom-6 right-6 z-50 w-80"
         >
           <div className="glass-strong rounded-xl p-4 glow-border overflow-hidden">
             <div className="flex items-start gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                 <activeNotification.icon className="w-5 h-5 text-primary" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-medium text-foreground">
                   {activeNotification.title}
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {activeNotification.message}
                 </div>
               </div>
               <button 
                 onClick={dismiss}
                 className="text-muted-foreground hover:text-foreground transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
 
             {/* Progress bar */}
             <motion.div 
               className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
               initial={{ width: '100%' }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.08, ease: "linear" }}
             />
 
             {/* Glow pulse */}
             <motion.div
               className="absolute inset-0 rounded-xl pointer-events-none"
               animate={{ 
                 boxShadow: [
                   'inset 0 0 0 1px hsl(191 100% 62% / 0.1)',
                   'inset 0 0 0 1px hsl(191 100% 62% / 0.3)',
                   'inset 0 0 0 1px hsl(191 100% 62% / 0.1)',
                 ]
               }}
               transition={{ duration: 2, repeat: Infinity }}
             />
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };