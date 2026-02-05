 import { motion } from 'framer-motion';
 import { 
   Brain, 
   Globe, 
   Users, 
   Zap, 
   Shield, 
   BarChart3 
 } from 'lucide-react';
 
 const features = [
   {
     icon: Brain,
     title: 'AI-Powered Analysis',
     description: 'Advanced machine learning algorithms analyze research patterns and suggest connections.',
   },
   {
     icon: Globe,
     title: 'Global Network',
     description: 'Connect with researchers across 180+ countries in real-time collaboration spaces.',
   },
   {
     icon: Users,
     title: 'Peer Review',
     description: 'Streamlined peer review process with transparent feedback and recognition.',
   },
   {
     icon: Zap,
     title: 'Instant Publishing',
     description: 'Publish your findings instantly with DOI generation and indexing.',
   },
   {
     icon: Shield,
     title: 'Data Security',
     description: 'Enterprise-grade encryption and compliance with research data standards.',
   },
   {
     icon: BarChart3,
     title: 'Impact Metrics',
     description: 'Track your research impact with comprehensive analytics and citations.',
   },
 ];
 
 export const FeaturesSection = () => {
   return (
     <section id="platform" className="relative py-24 lg:py-32">
       {/* Section divider - wave gradient */}
       <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-muted/20 pointer-events-none" />
       
       <div className="container mx-auto px-6">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
         >
           <span className="inline-block px-4 py-2 rounded-full glass border border-primary/30 text-sm text-muted-foreground mb-4">
             Platform Features
           </span>
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
             Everything You Need to
             <br />
             <span className="gradient-text">Accelerate Discovery</span>
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Our platform combines cutting-edge technology with intuitive design 
             to help researchers focus on what matters most.
           </p>
         </motion.div>
 
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <FeatureCard key={feature.title} feature={feature} index={index} />
           ))}
         </div>
       </div>
 
       {/* Nebula accent */}
       <div 
         className="absolute bottom-0 left-1/4 w-1/2 h-1/2 opacity-10 blur-3xl pointer-events-none"
         style={{
           background: 'radial-gradient(circle, hsl(191 100% 62% / 0.4) 0%, transparent 70%)',
         }}
       />
     </section>
   );
 };
 
 interface FeatureCardProps {
   feature: {
     icon: React.ElementType;
     title: string;
     description: string;
   };
   index: number;
 }
 
 const FeatureCard = ({ feature, index }: FeatureCardProps) => {
   const Icon = feature.icon;
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 40 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.5, delay: index * 0.1 }}
       whileHover={{ y: -8 }}
       className="group relative glass rounded-2xl p-6 card-lift glow-border overflow-hidden"
     >
       {/* Shimmer effect */}
       <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
       
       {/* Icon */}
       <div className="relative mb-4">
         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
           <Icon className="w-6 h-6 text-primary" />
         </div>
         {/* Icon glow on hover */}
         <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
 
       {/* Content */}
       <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
         {feature.title}
       </h3>
       <p className="text-sm text-muted-foreground leading-relaxed">
         {feature.description}
       </p>
 
       {/* Border glow effect */}
       <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
         style={{
           boxShadow: 'inset 0 0 20px hsl(191 100% 62% / 0.1)',
         }}
       />
     </motion.div>
   );
 };