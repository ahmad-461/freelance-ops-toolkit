interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": "https://freelance-ops-toolkit-6w1z.vercel.app/#person";
  "name": "Muhammad Ahmad Khan";
  "givenName": "Muhammad Ahmad";
  "familyName": "Khan";
  "jobTitle": "Student Developer";
  "url": "https://freelance-ops-toolkit-6w1z.vercel.app/about";
  "sameAs": [
    "https://github.com/ahmad-461",
    "https://www.linkedin.com/in/ahmad-khan-77441833a"
  ];
}

export const authorPerson: PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://freelance-ops-toolkit-6w1z.vercel.app/#person",
  "name": "Muhammad Ahmad Khan",
  "givenName": "Muhammad Ahmad",
  "familyName": "Khan",
  "jobTitle": "Student Developer",
  "url": "https://freelance-ops-toolkit-6w1z.vercel.app/about",
  "sameAs": [
    "https://github.com/ahmad-461",
    "https://www.linkedin.com/in/ahmad-khan-77441833a"
  ]
};

export function getWebApplicationJsonLd(name: string, url: string, description: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": name,
      "url": url,
      "description": description,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 compatible browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "isAccessibleForFree": true,
      "creator": {
        "@type": "Person",
        "@id": "https://freelance-ops-toolkit-6w1z.vercel.app/#person"
      },
      "author": {
        "@type": "Person",
        "@id": "https://freelance-ops-toolkit-6w1z.vercel.app/#person"
      }
    },
    authorPerson
  ];
}
