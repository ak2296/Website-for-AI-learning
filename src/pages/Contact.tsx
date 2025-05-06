// src/pages/Contact.tsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Get in Touch</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Hook this up with your back-end later.
            alert('Message sent!');
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Your Message"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </motion.div>
  );
}
