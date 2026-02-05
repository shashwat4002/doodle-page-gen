 import { useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Menu, X, ChevronDown } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Link, useNavigate } from 'react-router-dom';
 
 const navItems = [
   { label: 'Platform', href: '#platform' },
   { label: 'Research', href: '#research' },
   { label: 'Community', href: '#community' },
   { label: 'About', href: '#about' },
 ];
 
 export const Navbar = () => {
   const navigate = useNavigate();
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeItem, setActiveItem] = useState<string | null>(null);
 
   useEffect(() => {
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 20);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, []);
 
   return (
     <motion.nav
       initial={{ y: -100, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.6, ease: "easeOut" }}
       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
         isScrolled 
           ? 'glass-strong py-3' 
           : 'bg-transparent py-5'
       }`}
     >
       <div className="container mx-auto px-6">
         <div className="flex items-center justify-between">
           {/* Logo */}
           <motion.div whileHover={{ scale: 1.02 }}>
             <Link
               to="/"
               className="flex items-center gap-2 group"
             >
               <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
                 <span className="text-primary-foreground font-bold text-lg">S</span>
                 <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg group-hover:blur-xl transition-all" />
               </div>
               <span className="text-xl font-bold text-foreground">
                 Soch<span className="text-primary">X</span>
               </span>
             </Link>
           </motion.div>
 
           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center gap-1">
             {navItems.map((item) => (
               <NavItem
                 key={item.label}
                 item={item}
                 isActive={activeItem === item.label}
                 onHover={() => setActiveItem(item.label)}
                 onLeave={() => setActiveItem(null)}
               />
             ))}
           </div>
 
           {/* CTA Buttons */}
           <div className="hidden md:flex items-center gap-3">
             <Button 
               variant="ghost" 
               className="text-foreground hover:text-primary hover:bg-primary/10"
               onClick={() => navigate('/auth/login')}
             >
               Sign In
             </Button>
             <Button 
               className="btn-ripple bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-shadow"
               onClick={() => navigate('/auth/register')}
             >
               Get Started
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <button
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
           >
             {isMobileMenuOpen ? (
               <X className="w-6 h-6 text-foreground" />
             ) : (
               <Menu className="w-6 h-6 text-foreground" />
             )}
           </button>
         </div>
 
         {/* Mobile Menu */}
         <AnimatePresence>
           {isMobileMenuOpen && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ duration: 0.3 }}
               className="md:hidden mt-4 pb-4"
             >
               <div className="flex flex-col gap-2">
                 {navItems.map((item, index) => (
                   <motion.a
                     key={item.label}
                     href={item.href}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {item.label}
                   </motion.a>
                 ))}
                 <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                   <Button
                     variant="ghost"
                     className="justify-start"
                     onClick={() => {
                       navigate('/auth/login');
                       setIsMobileMenuOpen(false);
                     }}
                   >
                     Sign In
                   </Button>
                   <Button
                     className="bg-gradient-to-r from-primary to-secondary"
                     onClick={() => {
                       navigate('/auth/register');
                       setIsMobileMenuOpen(false);
                     }}
                   >
                     Get Started
                   </Button>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </motion.nav>
   );
 };
 
 interface NavItemProps {
   item: { label: string; href: string };
   isActive: boolean;
   onHover: () => void;
   onLeave: () => void;
 }
 
 const NavItem = ({ item, isActive, onHover, onLeave }: NavItemProps) => {
   return (
     <a
       href={item.href}
       onMouseEnter={onHover}
       onMouseLeave={onLeave}
       className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
     >
       {item.label}
       {/* Active underline */}
       <motion.div
         className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-primary to-secondary rounded-full"
         initial={{ width: 0, x: '-50%' }}
         animate={{ 
           width: isActive ? '60%' : 0,
           x: '-50%',
         }}
         transition={{ duration: 0.2 }}
       />
       {/* Glow effect */}
       {isActive && (
         <motion.div
           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 blur-md bg-primary/50"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
         />
       )}
     </a>
   );
 };