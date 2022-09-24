import CreateLock from "../../components/CreateLock";
import Layout from "../../components/layout/Layout";

export default function CreateLockPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-md sm:max-w-3xl mb-8 sm:mb-12">
          <CreateLock />
        </div>
      </div>
    </Layout>
  );
}
