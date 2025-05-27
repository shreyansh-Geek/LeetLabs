import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, FileText, MessageSquare, Bug } from 'lucide-react';
import { useSheets } from '@/lib/sheets';

const QuickActions = ({ userSheets }) => {
  const { error } = useSheets();

  const actions = [
    {
      label: 'Solve Problems',
      href: '/problems',
      icon: <Code className="h-5 w-5" />,
      color: 'yellow',
    },
    {
      label: `My Sheets (${userSheets?.length || 0})`,
      href: '/sheets/my',
      icon: <FileText className="h-5 w-5" />,
      color: 'yellow',
    },
    {
      label: 'Feedback Form',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSe0PvWcAlgISmS1tnsxf4a7iWTET8eWX5ydBPOTFlN8y8Wcvg/viewform?usp=header',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'yellow',
    },
    {
      label: 'Report an Issue',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfzayNk_6hxOC0tly4HZ_IuHftMisLqCLc8LKdh28KuwMH_Cw/viewform?usp=header',
      icon: <Bug className="h-5 w-5" />,
      color: 'yellow',
    },
  ];

  const isExternalLink = (href) => href.startsWith('https://') || href.startsWith('http://');

  if (error) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50 text-white">
        <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
        <p>Error loading sheets: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700/50"
    >
      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          isExternalLink(action.href) ? (
            <a
              key={index}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-4 rounded-xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/20 border border-${action.color}-500/30 hover:border-${action.color}-500/50 transition-all duration-300 group`}
              >
                <div className={`p-3 rounded-lg bg-${action.color}-500/20 mb-3 w-fit`}>
                  {React.cloneElement(action.icon, { className: `h-5 w-5 text-${action.color}-400` })}
                </div>
                <h4 className="text-white font-semibold group-hover:text-yellow-400} transition-colors">
                  {action.label}
                </h4>
              </motion.div>
            </a>
          ) : (
            <Link key={index} to={action.href} className="block">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-4 rounded-xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/20 border border-${action.color}-500/30 hover:border-${action.color}-500/50 transition-all duration-300 group`}
              >
                <div className={`p-3 rounded-lg bg-${action.color}-500/20 mb-3 w-fit`}>
                  {React.cloneElement(action.icon, { className: `h-5 w-5 text-${action.color}-400` })}
                </div>
                <h4 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                  {action.label}
                </h4>
              </motion.div>
            </Link>
          )
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;