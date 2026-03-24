import Image from "next/image";

export const metadata = {
  title: "Rashaduldev - Cookies Policy",
  description:
    "Learn about our cookies policy and how we use cookies on our website.",
};

const CookiesPolicy = () => {
  return (
    <main className="max-w-7xl mx-auto mt-24 rounded overflow-hidden border px-3 md:px-0 my-10">
      {/* Hero Image Section */}
      <div className="relative w-full h-64 sm:h-96">
        <Image
          src="https://res.cloudinary.com/de8yddexc/image/upload/v1748528683/resume/cgeslgurmvval32npu18.webp"
          alt="Cookies Policy Banner"
          fill
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Content Section */}
      <section className="p-8 space-y-8">
        <p className="leading-relaxed">
          This Cookies Policy explains how our website uses cookies to improve
          your experience. Cookies are small text files stored on your device to
          help us recognize you and remember your preferences.
        </p>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            What Are Cookies?
          </h2>
          <p className="leading-relaxed">
            Cookies are small data files placed on your device when you visit a
            website. They help the site remember information about your visit,
            like your language preference or login status, to provide a better
            browsing experience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Types of Cookies We Use
          </h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function properly. They enable core features like page navigation
              and secure areas.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Collect information about
              how visitors use our site to help us improve performance and user
              experience.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences and
              choices (e.g., language or region) to personalize your experience.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to track visitors across
              websites to display relevant advertising.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Managing Your Cookies Preferences
          </h2>
          <p className="leading-relaxed mb-2">
            You can control or disable cookies by adjusting your browser
            settings. Please note that blocking some cookies may affect website
            functionality.
          </p>
          <p className="leading-relaxed">
            For more information on how to manage cookies in popular browsers,
            visit{" "}
            <a
              href="https://www.aboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              aboutcookies.org
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Updates to This Policy
          </h2>
          <p className="leading-relaxed">
            We may update this Cookies Policy occasionally to reflect changes to
            our practices or legal requirements. We encourage you to review this
            page periodically.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Contact Me
          </h2>
          <p className="leading-relaxed">
            If you have questions about our Cookies Policy, please contact us at{" "}
            <a
              href="mailto:rashadul.dev@gmail.com"
              className="text-primary hover:underline"
            >
              rashadul.dev@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
};

export default CookiesPolicy;
