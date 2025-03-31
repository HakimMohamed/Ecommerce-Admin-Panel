"use client";
import {
  getBannerSettings,
  updateBannerSettings,
} from "@/services/banner.service";
import { Input } from "@heroui/input";
import { addToast, Card } from "@heroui/react";
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect } from "react";

const BannerEditor = () => {
  const [bannerText, setBannerText] = useState("Loading...");
  const [bannerColor, setBannerColor] = useState("#7b42f5");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const colorOptions = [
    { color: "#7b42f5", name: "Purple" },
    { color: "#f542a1", name: "Pink" },
    { color: "#42b5f5", name: "Blue" },
    { color: "#42f56f", name: "Green" },
    { color: "#f5a742", name: "Orange" },
    { color: "#f54242", name: "Red" },
    { color: "#000000", name: "Black" },
    { color: "#ffffff", name: "White" },
  ];

  // Fetch current settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getBannerSettings();
        setBannerText(res.data.data.text);
        setBannerColor(res.data.data.color);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save updated settings to API
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBannerSettings(bannerText, bannerColor);
      addToast({
        title: "Settings saved",
        description: "Settings have been saved successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error saving settings", error);
      addToast({
        title: "Failed to save settings",
        description: "An error occurred while saving settings",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div
          style={{
            width: "100%",
            padding: "12px 0",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: bannerColor,
            color: getTextColor(bannerColor),
            transition: "background-color 0.3s, color 0.3s",
            marginBottom: "2rem",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {bannerText}
        </div>

        <Card className="p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Customize Your Banner</h2>

          <div className="mb-6">
            <label
              htmlFor="bannerText"
              className="block text-sm font-medium mb-2"
            >
              Banner Text:
            </label>
            <Input
              type="text"
              id="bannerText"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="w-full p-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Quick Colors:
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => setBannerColor(option.color)}
                  className={`w-10 h-10 rounded-md transition-transform hover:scale-110 ${
                    bannerColor === option.color
                      ? "ring-2 ring-offset-2 ring-gray-800"
                      : ""
                  }`}
                  style={{
                    backgroundColor: option.color,
                    border:
                      option.color === "#ffffff" ? "1px solid #e5e5e5" : "none",
                  }}
                  title={option.name}
                  aria-label={`Select ${option.name} color`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="colorPicker"
              className="block text-sm font-medium mb-2"
            >
              Choose Custom Color:
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="colorPicker"
                value={bannerColor}
                onChange={(e) => setBannerColor(e.target.value)}
                className="h-10 w-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bannerColor}
                onChange={(e) => {
                  if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
                    setBannerColor(e.target.value);
                  }
                }}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#7b42f5"
              />
              <span className="text-sm text-gray-500">Current color code</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-all"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default BannerEditor;
