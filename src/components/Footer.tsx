 import { motion } from 'framer-motion';
 import { 
   Twitter, 
   Linkedin, 
   Github, 
   Mail,
   ArrowUpRight
 } from 'lucide-react';
 
 const footerLinks = {
   Platform: ['Features', 'Pricing', 'API', 'Integrations'],
   Research: ['Browse Papers', 'Submit Research', 'Peer Review', 'Datasets'],
   Company: ['About', 'Careers', 'Blog', 'Press'],
   Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
 };
 
 const socialLinks = [
   { icon: Twitter, href: '#', label: 'Twitter' },
   { icon: Linkedin, href: '#', label: 'LinkedIn' },
   { icon: Github, href: '#', label: 'GitHub' },
   { icon: Mail, href: '#', label: 'Email' },
 ];
 
 export const Footer = () => {
   return (
     <footer className="relative border-t border-border">
       {/* Gradient divider */}
       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
       
       <div className="container mx-auto px-6 py-16">
         <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
           {/* Brand */}
           <div className="col-span-2 md:col-span-1">
             <a href="#" className="flex items-center gap-2 mb-4">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                 <span className="text-primary-foreground font-bold text-lg">S</span>
               </div>
               <span className="text-xl font-bold text-foreground">
                 Soch<span className="text-primary">X</span>
               </span>
             </a>
             <p className="text-sm text-muted-foreground mb-4">
               Accelerating research discovery through intelligent connections.
             </p>
             {/* Social links */}
             <div className="flex gap-3">
               {socialLinks.map((social) => (
                 <motion.a
                   key={social.label}
                   href={social.href}
                   whileHover={{ scale: 1.1, y: -2 }}
                   className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                 >
                   <social.icon className="w-4 h-4" />
                 </motion.a>
               ))}
             </div>
           </div>
 
           {/* Links */}
           {Object.entries(footerLinks).map(([title, links]) => (
             <div key={title}>
               <h4 className="font-semibold text-foreground mb-4">{title}</h4>
               <ul className="space-y-2">
                 {links.map((link) => (
                   <li key={link}>
                     <a 
                       href="#" 
                       className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                     >
                       {link}
                       <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
         </div>
 
         {/* Bottom bar */}
         <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-sm text-muted-foreground">
             © 2024 SochX. All rights reserved.
           </p>
           <div className="flex items-center gap-6">
             <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
               Privacy Policy
             </a>
             <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
               Terms of Service
             </a>
           </div>
         </div>
       </div>
 
       {/* Nebula glow */}
       <div 
         className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 opacity-10 blur-3xl pointer-events-none"
         style={{
           background: 'radial-gradient(ellipse, hsl(191 100% 62% / 0.4) 0%, transparent 70%)',
         }}
       />
     </footer>
   );
 };