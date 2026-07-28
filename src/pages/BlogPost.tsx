import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Loader2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Blog {
  id: number;
  title: string;
  slug?: string;
  category: string;
  banner_image: string;
  publish_date: string;
  read_time: string;
  content: string;
  short_description?: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // TOC State
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const isNumeric = /^\d+$/.test(slug || '');
        const queryParam = isNumeric ? `id=${slug}` : `slug=${slug}`;
        const [blogRes, allRes] = await Promise.all([
          fetch(`/api/admin-blogs?${queryParam}`),
          fetch(`/api/admin-blogs?status=published`)
        ]);
        const blogData = await blogRes.json();
        const allData = await allRes.json();
        
        if (blogData.blog) setBlog(blogData.blog);
        if (allData.blogs) setAllBlogs(allData.blogs);
      } catch (error) {
        console.error("Failed to fetch blog data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Extract headings and setup intersection observer for TOC
  useEffect(() => {
    if (!blog || !contentRef.current) return;

    // Give React time to render dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      if (!contentRef.current) return;
      const elements = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
      const extractedHeadings = elements.map((el, index) => {
        // Add ID if missing so we can link to it
        if (!el.id) {
          el.id = `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.replace('H', ''), 10)
        };
      }).filter(h => h.text.trim() !== '');

      setHeadings(extractedHeadings);

      // Setup Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHeading(entry.target.id);
            }
          });
        },
        { rootMargin: '-100px 0px -60% 0px' }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [blog]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Increased offset for sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center text-white/40">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 px-6 min-h-screen text-center text-white/40">Blog not found.</div>
      </>
    );
  }

  // Calculate Related Blogs
  const otherBlogs = allBlogs.filter(b => b.id !== blog.id);
  const sameCategory = otherBlogs.filter(b => b.category === blog.category);
  const differentCategory = otherBlogs.filter(b => b.category !== blog.category);
  const relatedBlogs = [...sameCategory, ...differentCategory].slice(0, 3);

  return (
    <>
      <Navbar />
      
      {/* Top Banner (Optional for single blog) */}
      <div className="bg-white/5 border-b border-white/10 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-cyber-teal hover:text-white transition-colors font-bold uppercase tracking-widest text-xs mb-8">
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-wider mb-6">
            {blog.category && <span className="bg-cyber-teal/10 px-2 py-1 rounded text-cyber-teal border border-cyber-teal/20">{blog.category}</span>}
            <span>{blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Draft'}</span>
            {blog.read_time && <span className="flex items-center gap-1"><Clock size={12} /> {blog.read_time}</span>}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter uppercase text-white leading-tight max-w-5xl">
            {blog.title}
          </h1>
        </div>
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Left Column: Table of Contents (Sticky) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 bg-white/5 border border-white/10 p-6 rounded-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-display font-black uppercase text-white mb-6 border-b border-white/10 pb-4">
                Table of Contents
              </h3>
              {headings.length === 0 ? (
                <p className="text-white/40 text-sm">No sections found.</p>
              ) : (
                <nav className="flex flex-col gap-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => scrollToHeading(e, heading.id)}
                      className={`text-sm transition-all duration-300 line-clamp-2 ${
                        heading.level > 2 ? 'ml-4' : ''
                      } ${
                        activeHeading === heading.id 
                          ? 'text-cyber-teal font-bold scale-105 origin-left' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* Center Column: Blog Content */}
          <article className="lg:col-span-6 min-w-0">
            {blog.banner_image && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10">
                <img src={blog.banner_image} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div 
              ref={contentRef}
              className="prose prose-invert prose-lg max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:scroll-mt-32
              prose-a:text-cyber-teal hover:prose-a:text-white prose-a:transition-colors
              prose-img:rounded-2xl prose-img:border prose-img:border-white/10
              [&_*]:!break-words [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_p]:!break-words"
              dangerouslySetInnerHTML={{ __html: blog.content || '' }}
            />
          </article>

          {/* Right Column: CTA Form (Sticky) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyber-teal/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="text-xl font-display font-black uppercase text-white mb-2 relative z-10">
                Talk to Our AI Experts
              </h3>
              <p className="text-white/60 text-sm mb-6 relative z-10">
                Find smarter, cost-effective solutions for your business.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
                <div>
                  <input required type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-obsidian/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal outline-none transition-all text-sm" />
                </div>
                <div>
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-obsidian/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal outline-none transition-all text-sm" />
                </div>
                <div>
                  <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-obsidian/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal outline-none transition-all text-sm" />
                </div>
                <div>
                  <textarea required placeholder="Your Message" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-obsidian/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal outline-none transition-all text-sm resize-none" />
                </div>

                <button disabled={isSubmitting} className="w-full py-4 rounded-xl text-sm font-black text-obsidian bg-cyber-teal hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-cyber-teal/25">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Book a FREE Consultation</>}
                </button>

                {submitStatus === 'success' && <p className="text-emerald-400 text-xs text-center mt-2 font-bold">Message sent successfully!</p>}
                {submitStatus === 'error' && <p className="text-red-400 text-xs text-center mt-2 font-bold">Failed to send message. Try again.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <div className="bg-[#121525] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-black tracking-tight uppercase text-white">
                Related <span className="text-cyber-teal">Blogs</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((b) => (
                <Link key={b.id} to={`/blog/${b.slug || b.id}`} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyber-teal/50 hover:bg-white/[0.07] transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-white/10 relative">
                    {b.banner_image ? (
                      <img src={b.banner_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold text-cyber-teal uppercase tracking-wider mb-3">
                      {b.category && <span className="bg-cyber-teal/10 px-2 py-1 rounded-md border border-cyber-teal/20">{b.category}</span>}
                      <span>{new Date(b.publish_date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-teal transition-colors line-clamp-2 mb-3">
                      {b.title}
                    </h3>
                    <div className="mt-auto text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
                      Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
