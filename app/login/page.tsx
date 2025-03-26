"use client";

import React, { useState } from "react";
import { Button, Input, Link, Form, InputOtp, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { login, verifyOtp } from "@/services/auth.service";

export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!userEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(userEmail, password);
      setEmail(userEmail);
      setIsOtpVisible(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong, try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otpValue.length !== 4) {
      setOtpError("Please enter a 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(email, otpValue);
      const token = response.data.data;

      localStorage.setItem("token", token);
      setOtpError(null);
      setOtpSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 4000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setOtpError("Failed to verify OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg px-8 pb-10 pt-6 shadow-md">
        <p className="pb-4 text-center text-3xl font-semibold">
          {isOtpVisible ? "Enter OTP" : "Log In"}
        </p>

        {!isOtpVisible ? (
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
            />
            <Input
              isRequired
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button
              className="w-full"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Log In"}
            </Button>
          </Form>
        ) : (
          <Form
            className="flex flex-col items-center gap-4"
            onSubmit={handleOtpSubmit}
          >
            <InputOtp length={4} value={otpValue} onValueChange={setOtpValue} />

            {otpSuccess ? (
              <p className="text-green-500 text-sm font-medium">
                ✅ OTP Verified Successfully!
              </p>
            ) : (
              <>
                <Button
                  className="w-full"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Verify OTP"}
                </Button>
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </>
            )}
          </Form>
        )}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
