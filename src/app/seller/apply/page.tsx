"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const steps = [
  {
    number: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
  },
  {
    number: 2,
    title: "Store Information",
    description: "Set up your store",
  },
  {
    number: 3,
    title: "Business Information",
    description: "Tell us about your business",
  },
  {
    number: 4,
    title: "Verification",
    description: "Provide verification details",
  },
  {
    number: 5,
    title: "Seller Agreement",
    description: "Review marketplace terms",
  },
  {
    number: 6,
    title: "Submit",
    description: "Send your application",
  },
];

export default function SellerApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: "",
    storeDescription: "",
    category: "",
    productsToSell: "",
    businessType: "",
    businessAddress: "",
    city: "",
    state: "",
    businessRegistration: "",
    identityType: "",
    identityNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = event.target;

    const checked =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : undefined;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitError("");
  }

  function validateStep(step: number) {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.firstName.trim()) {
        newErrors.firstName = "First name is required.";
      }

      if (!form.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      if (!form.phone.trim()) {
        newErrors.phone = "Phone number is required.";
      }
    }

    if (step === 2) {
      if (!form.storeName.trim()) {
        newErrors.storeName = "Store name is required.";
      }

      if (!form.storeDescription.trim()) {
        newErrors.storeDescription =
          "Please provide a short description of your store.";
      }

      if (!form.category) {
        newErrors.category = "Please select a category.";
      }

      if (!form.productsToSell.trim()) {
        newErrors.productsToSell =
          "Please tell us what products you want to sell.";
      }
    }

    if (step === 3) {
      if (!form.businessType) {
        newErrors.businessType = "Please select your business type.";
      }

      if (!form.businessAddress.trim()) {
        newErrors.businessAddress = "Business address is required.";
      }

      if (!form.city.trim()) {
        newErrors.city = "City is required.";
      }

      if (!form.state.trim()) {
        newErrors.state = "State is required.";
      }
    }

    if (step === 4) {
      if (!form.identityType) {
        newErrors.identityType = "Please select an identity document.";
      }

      if (!form.identityNumber.trim()) {
        newErrors.identityNumber = "Identity number is required.";
      }

      if (!form.bankName) {
        newErrors.bankName = "Please select your bank.";
      }

      if (!form.accountName.trim()) {
        newErrors.accountName = "Account name is required.";
      }

      if (!form.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required.";
      } else if (!/^\d{10}$/.test(form.accountNumber.trim())) {
        newErrors.accountNumber =
          "Account number must contain exactly 10 digits.";
      }
    }

    if (step === 5) {
      if (!form.agreeToTerms) {
        newErrors.agreeToTerms =
          "You must agree to the seller terms to continue.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function validateAllSteps() {
    for (let step = 1; step <= 5; step++) {
      const valid = validateStep(step);

      if (!valid) {
        setCurrentStep(step);
        return false;
      }
    }

    return true;
  }

  function handleNext() {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 6) {
      setCurrentStep((current) => current + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((current) => current - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError("");

    const valid = validateAllSteps();

    if (!valid) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          storeName: form.storeName.trim(),
          storeDescription: form.storeDescription.trim(),
          category: form.category,
          productsToSell: form.productsToSell.trim(),
          businessType: form.businessType,
          businessAddress: form.businessAddress.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          businessRegistration: form.businessRegistration.trim(),
          identityType: form.identityType,
          identityNumber: form.identityNumber.trim(),
          bankName: form.bankName,
          accountName: form.accountName.trim(),
          accountNumber: form.accountNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit seller application."
        );
      }

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("SELLER APPLICATION SUBMIT ERROR:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-orange-500 px-4 py-5 text-white shadow-sm sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-wide sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            <Link
              href="/account"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-orange-500 transition hover:bg-gray-100"
            >
              My Account
            </Link>
          </div>
        </header>

        <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
              ✓
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-orange-500">
              Application Submitted
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your seller application is under review
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Thank you for applying to sell on Marketplace. Your application
              has been successfully submitted and is now waiting for review by
              our team.
            </p>

            <div className="mt-8 rounded-xl border border-orange-100 bg-orange-50 p-5 text-left">
              <h2 className="font-bold text-gray-900">What happens next?</h2>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    1
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Application review
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Our team reviews your seller information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    2
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Verification</p>

                    <p className="mt-1 text-sm text-gray-500">
                      We verify the submitted business and account
                      information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    3
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Seller approval
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Once approved, your Seller Center will become available.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/account"
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Go to My Account
              </Link>

              <Link
                href="/"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 px-4 py-5 text-white shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-wide sm:text-2xl"
          >
            MARKETPLACE
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="hidden rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25 sm:block"
            >
              My Account
            </Link>

            <Link
              href="/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-orange-500 transition hover:bg-gray-100"
            >
              Shop
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#151515] px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-400">
            Seller Center
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Start selling on Marketplace
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Join thousands of sellers reaching customers across Nigeria.
            Complete your seller application and our team will review your
            information.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex min-w-[850px] items-center justify-between gap-2">
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    className="flex flex-1 items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isCompleted ? "✓" : step.number}
                      </div>

                      <div>
                        <p
                          className={`text-sm font-bold ${
                            isActive
                              ? "text-orange-600"
                              : isCompleted
                                ? "text-green-600"
                                : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="mx-4 h-px flex-1 bg-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                  Step {currentStep} of 6
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              {submitError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-800">
                    Application could not be submitted
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        error={errors.firstName}
                        required
                      />

                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        error={errors.lastName}
                        required
                      />
                    </div>

                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      error={errors.email}
                      required
                    />

                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      error={errors.phone}
                      required
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      label="Store Name"
                      name="storeName"
                      value={form.storeName}
                      onChange={handleChange}
                      placeholder="e.g. Olushola Electronics"
                      error={errors.storeName}
                      required
                    />

                    <div>
                      <label
                        htmlFor="storeDescription"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Store Description
                      </label>

                      <textarea
                        id="storeDescription"
                        name="storeDescription"
                        value={form.storeDescription}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell customers what your store sells..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />

                      {errors.storeDescription && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.storeDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Main Product Category
                      </label>

                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select a category</option>
                        <option value="Phones & Tablets">
                          Phones & Tablets
                        </option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Office">Home & Office</option>
                        <option value="Health & Beauty">
                          Health & Beauty
                        </option>
                        <option value="Computing">Computing</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Other">Other</option>
                      </select>

                      {errors.category && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="productsToSell"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Products You Intend to Sell
                      </label>

                      <textarea
                        id="productsToSell"
                        name="productsToSell"
                        value={form.productsToSell}
                        onChange={handleChange}
                        rows={4}
                        placeholder="e.g. smartphones, phone accessories and electronics"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />

                      {errors.productsToSell && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.productsToSell}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="businessType"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Business Type
                      </label>

                      <select
                        id="businessType"
                        name="businessType"
                        value={form.businessType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select business type</option>
                        <option value="Individual">Individual</option>
                        <option value="Sole Proprietorship">
                          Sole Proprietorship
                        </option>
                        <option value="Partnership">Partnership</option>
                        <option value="Limited Company">
                          Limited Company
                        </option>
                        <option value="Other">Other</option>
                      </select>

                      {errors.businessType && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.businessType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="businessAddress"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Business Address
                      </label>

                      <textarea
                        id="businessAddress"
                        name="businessAddress"
                        value={form.businessAddress}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter your business address"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />

                      {errors.businessAddress && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.businessAddress}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Ibadan"
                        error={errors.city}
                        required
                      />

                      <FormField
                        label="State"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="e.g. Oyo"
                        error={errors.state}
                        required
                      />
                    </div>

                    <FormField
                      label="Business Registration Number"
                      name="businessRegistration"
                      value={form.businessRegistration}
                      onChange={handleChange}
                      placeholder="Optional"
                      error={errors.businessRegistration}
                    />

                    <p className="rounded-lg bg-gray-50 p-4 text-xs leading-6 text-gray-500">
                      If your business is registered, you can provide the
                      registration number. If you operate as an individual
                      seller, you can leave this field empty.
                    </p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm font-bold text-blue-900">
                        Verification information
                      </p>

                      <p className="mt-1 text-xs leading-6 text-blue-700">
                        Verification helps us protect customers and sellers on
                        Marketplace.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="identityType"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Identity Document
                      </label>

                      <select
                        id="identityType"
                        name="identityType"
                        value={form.identityType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select identity document</option>
                        <option value="National ID">National ID</option>
                        <option value="International Passport">
                          International Passport
                        </option>
                        <option value="Driver's License">
                          Driver's License
                        </option>
                        <option value="Voter's Card">Voter's Card</option>
                      </select>

                      {errors.identityType && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.identityType}
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Identity Number"
                      name="identityNumber"
                      value={form.identityNumber}
                      onChange={handleChange}
                      placeholder="Enter your identity number"
                      error={errors.identityNumber}
                      required
                    />

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900">
                        Payment Account
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        This information will be used for seller payouts after
                        your account is approved.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="bankName"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        Bank
                      </label>

                      <select
                        id="bankName"
                        name="bankName"
                        value={form.bankName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select your bank</option>
                        <option value="Access Bank">Access Bank</option>
                        <option value="GTBank">GTBank</option>
                        <option value="First Bank">First Bank</option>
                        <option value="UBA">UBA</option>
                        <option value="Zenith Bank">Zenith Bank</option>
                        <option value="Stanbic IBTC">Stanbic IBTC</option>
                        <option value="Sterling Bank">Sterling Bank</option>
                        <option value="Fidelity Bank">Fidelity Bank</option>
                        <option value="Union Bank">Union Bank</option>
                        <option value="FCMB">FCMB</option>
                        <option value="Other">Other</option>
                      </select>

                      {errors.bankName && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Account Name"
                      name="accountName"
                      value={form.accountName}
                      onChange={handleChange}
                      placeholder="Name on your bank account"
                      error={errors.accountName}
                      required
                    />

                    <FormField
                      label="Account Number"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit account number"
                      error={errors.accountNumber}
                      required
                      inputMode="numeric"
                      maxLength={10}
                    />

                    <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                      <p className="text-xs leading-6 text-yellow-800">
                        Your identity and payment information should only be
                        provided through this secure application process. Do
                        not share these details publicly.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="font-bold text-gray-900">
                        Marketplace Seller Terms
                      </h3>

                      <div className="mt-4 max-h-72 space-y-4 overflow-y-auto text-sm leading-6 text-gray-600">
                        <p>
                          By becoming a Marketplace seller, you agree to
                          provide accurate information about your business and
                          products.
                        </p>

                        <p>
                          Sellers are responsible for ensuring that products
                          listed on Marketplace are genuine, accurately
                          described and comply with applicable laws and
                          Marketplace policies.
                        </p>

                        <p>
                          Products may be reviewed before they become visible
                          to customers.
                        </p>

                        <p>
                          Sellers must process customer orders responsibly and
                          maintain accurate inventory information.
                        </p>

                        <p>
                          Marketplace may suspend or restrict seller accounts
                          that violate its policies or applicable laws.
                        </p>

                        <p>
                          Seller fees, commissions and payout rules may apply
                          according to the Marketplace seller policies.
                        </p>
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={form.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />

                      <span className="text-sm leading-6 text-gray-600">
                        I confirm that the information I have provided is
                        accurate and I agree to the Marketplace Seller Terms
                        and Policies.
                      </span>
                    </label>

                    {errors.agreeToTerms && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                      <h3 className="font-bold text-gray-900">
                        Review your application
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        Please review the information below before submitting
                        your application.
                      </p>
                    </div>

                    <ReviewSection
                      title="Personal Information"
                      items={[
                        [
                          "Full Name",
                          `${form.firstName} ${form.lastName}`,
                        ],
                        ["Email", form.email],
                        ["Phone", form.phone],
                      ]}
                    />

                    <ReviewSection
                      title="Store Information"
                      items={[
                        ["Store Name", form.storeName],
                        ["Category", form.category],
                        ["Products", form.productsToSell],
                      ]}
                    />

                    <ReviewSection
                      title="Business Information"
                      items={[
                        ["Business Type", form.businessType],
                        ["City", form.city],
                        ["State", form.state],
                        [
                          "Registration",
                          form.businessRegistration || "Not provided",
                        ],
                      ]}
                    />

                    <ReviewSection
                      title="Verification & Payment"
                      items={[
                        ["Identity", form.identityType],
                        [
                          "Identity Number",
                          maskValue(form.identityNumber),
                        ],
                        ["Bank", form.bankName],
                        ["Account Name", form.accountName],
                        [
                          "Account Number",
                          maskValue(form.accountNumber),
                        ],
                      ]}
                    />

                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                      <p className="text-sm font-bold text-green-800">
                        Ready to submit
                      </p>

                      <p className="mt-1 text-xs leading-6 text-green-700">
                        Your application will be submitted for review. You will
                        be notified when your seller application has been
                        reviewed.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={submitting}
                        className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        ← Back
                      </button>
                    )}
                  </div>

                  <div>
                    {currentStep < 6 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={submitting}
                        className="w-full rounded-lg bg-orange-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        Continue →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-orange-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {submitting
                          ? "Submitting Application..."
                          : "Submit Application"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                  🏪
                </div>

                <h2 className="mt-4 text-lg font-bold text-gray-900">
                  Why sell on Marketplace?
                </h2>

                <div className="mt-5 space-y-4">
                  <Benefit
                    title="Reach more customers"
                    description="Put your products in front of shoppers across Nigeria."
                  />

                  <Benefit
                    title="Manage your store"
                    description="Use Seller Center to manage products, orders and your store."
                  />

                  <Benefit
                    title="Secure payouts"
                    description="Receive your eligible seller earnings through your registered payment account."
                  />

                  <Benefit
                    title="Seller support"
                    description="Get support when you need help managing your Marketplace business."
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#151515] p-6 text-white shadow-sm">
                <p className="text-sm font-bold text-orange-400">
                  Seller onboarding
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Your application matters
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Providing complete and accurate information helps us review
                  your application more efficiently.
                </p>

                <div className="mt-5 rounded-xl bg-white/5 p-4">
                  <p className="text-xs leading-5 text-gray-400">
                    Your application will be reviewed before seller access is
                    granted.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="font-bold text-gray-900">Need help?</h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  If you have questions about becoming a seller, our support
                  team can help.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                  Contact Support →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Marketplace Footer */}
      <footer className="bg-[#111111] px-4 py-10 text-gray-400 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link
                href="/"
                className="text-xl font-extrabold tracking-wide text-white"
              >
                MARKETPLACE
              </Link>

              <p className="mt-3 text-sm leading-6">
                Your trusted online marketplace for quality products from
                verified sellers.
              </p>
            </div>

            <FooterColumn
              title="Customer Service"
              links={[
                ["Help Center", "/help"],
                ["Contact Us", "/contact"],
                ["Track Order", "/account/orders"],
                ["Returns & Refunds", "/returns"],
              ]}
            />

            <FooterColumn
              title="Marketplace"
              links={[
                ["Home", "/"],
                ["Categories", "/category"],
                ["Official Stores", "/official-stores"],
                ["Deals", "/deals"],
                ["New Arrivals", "/new-arrivals"],
                ["Top Selling", "/top-selling"],
                ["Flash Sales", "/flash-sales"],
              ]}
            />

            <FooterColumn
              title="Shop & Sell"
              links={[
                ["Shopping Cart", "/cart"],
                ["My Orders", "/account/orders"],
                ["Become a Seller", "/seller/apply"],
                ["Seller Center", "/seller"],
                ["Seller Policies", "/seller/policies"],
                ["Seller Support", "/seller/support"],
              ]}
            />
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/cookies"
                className="hover:text-white"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required = false,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-gray-800"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewSection({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="text-sm text-gray-500">{label}</span>

            <span className="break-words text-sm font-semibold text-gray-900 sm:max-w-[65%] sm:text-right">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
        ✓
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>

      <div className="mt-4 space-y-2">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="block text-sm transition hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function maskValue(value: string) {
  if (!value) {
    return "Not provided";
  }

  if (value.length <= 4) {
    return "••••";
  }

  return `••••${value.slice(-4)}`;
}