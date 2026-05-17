import { getApiUrl } from "@/config";
import AboutUsContent from "./_components";

const fetchData = async () => {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/mock_data/AboutUs.json`);
  if (!res.ok) {
    throw new Error("Failed to fetch mock data");
  }
  return res.json();
};

export default async function AboutUsPage() {
  const data = await fetchData();

  return (
    <div>
      <AboutUsContent data={data} />
    </div>
  );
}
