
import type { PageData } from "@/types/page";

import TourTemplate from "./TourTemplate";
import SocietyTemplate from "./SocietyTemplate";
import RestaurantTemplate from "./RestaurantTemplate";



type Props = {
  data: PageData;
};

const templateStyles: Record<
  string,
  {
    label: string;
    gradient: string;
    icon: string;
  }
> = {
  tour: {
    label: "Tours & Travel",
    gradient: "from-sky-600 to-cyan-500",
    icon: "✈️",
  },
  restaurant: {
    label: "Restaurant & Dining",
    gradient: "from-orange-600 to-amber-500",
    icon: "🍽️",
  },
  society: {
    label: "Society Management",
    gradient: "from-emerald-700 to-teal-500",
    icon: "🏢",
  },
  education: {
    label: "Education & School",
    gradient: "from-indigo-700 to-blue-500",
    icon: "🎓",
  },
  salon: {
    label: "Beauty & Salon",
    gradient: "from-fuchsia-700 to-pink-500",
    icon: "✂️",
  },
};



export default function TemplateRenderer({
  data,
}: Props) {
  const template = data.template ?? "";

  const config = templateStyles[template];

  // TemplateRenderer function के अंदर:
if (data.template === "tour") {
  return <TourTemplate data={data} />;
}

if (data.template === "society") {
  return <SocietyTemplate data={data} />;
}

if (data.template === "restaurant") {
  return <RestaurantTemplate data={data} />;
}
  if (!config) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Template Not Found
        </h1>
        <p>Template: {template || "none"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section
        className={`bg-gradient-to-r ${config.gradient} px-6 py-24 text-center text-white`}
      >
        <div className="mb-6 text-6xl">
          {config.icon}
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest">
          {config.label}
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          {data.title}
        </h1>

        <p className="mx-auto max-w-2xl text-lg opacity-90">
          {data.message}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Website Information
          </h2>

          <dl className="grid gap-5 sm:grid-cols-2">
            <Info label="Page Type" value={data.page_type} />
            <Info label="Business Type" value={data.business_type} />
            <Info label="Tenant" value={data.tenant} />
            <Info label="Parent Tenant" value={data.parent_tenant} />
            <Info label="Template" value={data.template} />
          </dl>
        </div>
      </section>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-gray-900">
        {value ?? "Not applicable"}
      </dd>
    </div>
  );
}
