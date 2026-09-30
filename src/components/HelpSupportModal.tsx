import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Mail, LifeBuoy, BookOpen, Bug } from 'lucide-react';
import { getAuditLogs } from '@/lib/auditLogger';

export default function HelpSupportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  const logs = getAuditLogs();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground flex items-center justify-center flex-shrink-0"
        aria-label="Help and Support"
      >
        <HelpCircle size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-amber-500" />
                  Help & Support
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4 font-body">
                <p className="text-sm text-muted-foreground">
                  Need assistance with your Box Art Lab project? Our support team is here to help you.
                </p>

                <div className="space-y-3 pt-2">
                  <a href="mailto:support@boxartlab.com" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Email Support</div>
                      <div className="text-xs text-muted-foreground">support@boxartlab.com</div>
                    </div>
                  </a>

                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group text-left">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Documentation</div>
                      <div className="text-xs text-muted-foreground">Read the user guide & tutorials</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowLogs(!showLogs)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-rose-500/30 hover:bg-rose-500/5 transition-colors group text-left"
                  >
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <Bug size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Diagnostic Logs</div>
                      <div className="text-xs text-muted-foreground">View local activity for troubleshooting</div>
                    </div>
                  </button>
                </div>

                {/* Diagnostic Logs Panel */}
                <AnimatePresence>
                  {showLogs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-xs max-h-40 overflow-y-auto">
                        <div className="font-semibold mb-2 flex justify-between items-center text-foreground">
                          <span>Local Audit Log</span>
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{logs.length} events</span>
                        </div>
                        {logs.length > 0 ? (
                          <div className="space-y-2">
                            {logs.map((log) => (
                              <div key={log.id} className="border-l-2 border-amber-500 pl-2">
                                <div className="font-medium text-foreground">{log.event}</div>
                                <div className="text-muted-foreground text-[10px]">{new Date(log.timestamp).toLocaleString()} - {log.userEmail}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic">No events logged yet.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
