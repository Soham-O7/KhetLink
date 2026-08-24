'use client';

import { useState } from 'react';
import {
  User2Icon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

import './SignupModal.css';

interface SignupModalProps {
  onClose: () => void;
  onLogin?: () => void;
}

export default function SignupModal({
  onClose,
  onLogin,
}: SignupModalProps) {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div
      className="signup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="signup-modal">

        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="signup-close"
          onClick={onClose}
          aria-label="Close sign up"
        >
          <X size={19} strokeWidth={2} />
        </button>


        {/* DECORATIVE LEAF */}

        <div className="signup-decoration signup-decoration-top">
          <span />
        </div>


        {/* LOGO */}

        <div className="signup-logo">

          <img
            src="/KhetLink_Logo.svg"
            alt="KhetLink Logo"
          />

        </div>


        {/* HEADER */}

        <div className="signup-header">

          <h2>Create Account</h2>

          <p>
            Sign up to get started with KhetLink
          </p>

        </div>


        {/* FORM */}

        <form
          className="signup-form"
          onSubmit={(event) => {
            event.preventDefault();

            // Signup logic will be added later.
          }}
        >

          {/* USERNAME */}

          <div className="signup-input-wrapper">

            <User2Icon
              className="signup-input-icon"
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

          <div className="signup-input-wrapper">

            <Mail
              className="signup-input-icon"
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


          {/* PHONE NUMBER */}

          <div className="signup-input-wrapper">

            <Phone
              className="signup-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              autoComplete="tel"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="signup-input-wrapper">

            <Lock
              className="signup-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="signup-password-toggle"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
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


          {/* CONFIRM PASSWORD */}

          <div className="signup-input-wrapper">

            <Lock
              className="signup-input-icon"
              size={20}
              strokeWidth={1.8}
            />

            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="signup-password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >

              {showConfirmPassword ? (
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


          {/* SIGN UP BUTTON */}

          <button
            type="submit"
            className="signup-submit"
          >
            Sign Up
          </button>

        </form>


        {/* DIVIDER */}

        <div className="signup-divider">

          <span />

          <p>or</p>

          <span />

        </div>


        {/* LOGIN */}

        <div className="signup-login">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            className="signup-login-link"
            onClick={onLogin}
          >
            Login
          </button>

        </div>


        {/* BOTTOM LANDSCAPE */}

        <div className="signup-landscape">

          <div className="signup-hill signup-hill-back" />

          <div className="signup-hill signup-hill-middle" />

          <div className="signup-hill signup-hill-front" />

        </div>

      </div>

    </div>
  );
}