"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaHandshake, FaComments } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UnauthorizedDialog from "./UnauthorizedDialog";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const CommunitySection = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Add state for managing modals
  const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Function to redirect to community page
  const redirectToCommunity = () => {
    router.push("/community");
  };

  // Updated to check if user is logged in
  const handleJoinNow = () => {
    if (user) {
      // User is logged in, navigate to community page
      router.push("/community");
    } else {
      // User is not logged in, show unauthorized dialog
      setShowUnauthorizedDialog(true);
    }
  };

  // Define the features array
  const features = [
    {
      icon: <FaUsers className="text-green-400 text-4xl" />,
      title: "Community Engagement",
      description:
        "Connect with like-minded individuals passionate about sustainability.",
    },
    {
      icon: <FaLightbulb className="text-green-400 text-4xl" />,
      title: "Innovative Ideas",
      description: "Share and discover innovative ideas for waste management.",
    },
    {
      icon: <FaHandshake className="text-green-400 text-4xl" />,
      title: "Collaborative Efforts",
      description: "Work together to create impactful solutions.",
    },
    {
      icon: <FaComments className="text-green-400 text-4xl" />,
      title: "Open Discussions",
      description: "Engage in meaningful discussions about sustainability.",
    },
  ];

  return (
    <section id="community" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Be part of a growing community dedicated to making a difference in
            waste management and sustainability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-500 mb-2">
                  {feature.title}
                </h3>
                <p className="text-white">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button
            onClick={handleJoinNow}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Join Now
          </button>
        </motion.div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onSuccess={redirectToCommunity} // Add this prop
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
        onSuccess={redirectToCommunity} // Add this prop
      />

      {/* Unauthorized Access Dialog */}
      <UnauthorizedDialog
        isOpen={showUnauthorizedDialog}
        onClose={() => setShowUnauthorizedDialog(false)}
        onLogin={() => {
          setShowUnauthorizedDialog(false);
          setShowLoginModal(true);
        }}
        onSignup={() => {
          setShowUnauthorizedDialog(false);
          setShowSignupModal(true);
        }}
      />
    </section>
  );
};

export default CommunitySection;
