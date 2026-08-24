'use client';

import { useState } from 'react';
import {
  User2Icon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
  onSignUp: () => void;
}

export default function LoginModal({ onClose, onSignUp,}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="login-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="login-modal">

        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="login-close"
          onClick={onClose}
          aria-label="Close login"
        >
          <X size={19} strokeWidth={2} />
        </button>


        {/* DECORATIVE LEAF */}
        <div className="login-decoration login-decoration-top">
          <span />
        </div>


        {/* LOGO */}
        <div className="login-logo">
          <img
            src="/KhetLink_Logo.svg"
            alt="KhetLink Logo"
          />
        </div>


        {/* HEADER */}
        <div className="login-header">
          <h2>Welcome Back!</h2>

          <p>
            Login to continue with KhetLink
          </p>
        </div>


        {/* LOGIN FORM */}
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();

            // Login logic will be added later.
          }}
        >

          {/* USERNAME */}
          <div className="login-input-wrapper">

            <User2Icon
              className="login-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              required
            />

          </div>


          {/* EMAIL */}
          <div className="login-input-wrapper">

            <Mail
              className="login-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type="email"
              name="email"
              placeholder="Email ID"
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}
          <div className="login-input-wrapper">

            <Lock
              className="login-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff
                  size={19}
                  strokeWidth={1.8}
                />
              ) : (
                <Eye
                  size={19}
                  strokeWidth={1.8}
                />
              )}
            </button>

          </div>


          {/* FORGOT PASSWORD */}
          <div className="forgot-password-row">

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>


        {/* OR DIVIDER */}
        <div className="login-divider">

          <span />

          <p>or</p>

          <span />

        </div>


        {/* SIGN UP */}
        <div className="login-signup">

          <span>
            Don&apos;t have an account?
          </span>

          <button
            type="button"
            className="login-signup-link"
            onClick={onSignUp}
          >
            Sign Up
          </button>

        </div>


        {/* BOTTOM LANDSCAPE */}
        <div className="login-landscape">

          <div className="login-hill login-hill-back" />

          <div className="login-hill login-hill-middle" />

          <div className="login-hill login-hill-front" />

        </div>

      </div>
    </div>
  );
}