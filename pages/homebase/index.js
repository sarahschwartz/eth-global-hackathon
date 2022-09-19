import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import { GlobeAltIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Layout from "../../components/layout/Layout";

const questions = [
  {
    id: "81614",
    locked: "true",
    likes: "29",
    replies: "11",
    views: "2.7k",
    author: {
      name: "@truecrimeobsessed.lens",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      href: "#",
    },
    date: "December 9 at 11:43 AM",
    datetime: "2020-12-09T11:43:00",
    href: "#",
    title: "What would you have done differently if you ran Jurassic Park?",
    body: `
      <p>Jurassic Park was an incredible idea and a magnificent feat of engineering, but poor protocols and a disregard for human safety killed what could have otherwise been one of the best businesses of our generation.</p>
      <p>Ultimately, I think that if you wanted to run the park successfully and keep visitors safe, the most important thing to prioritize would be&hellip;</p>
    `,
  },
  {
    id: "1234",
    locked: "false",
    likes: "29",
    replies: "11",
    views: "2.7k",
    author: {
      name: "@truecrimeobsessed.lens",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      href: "#",
    },
    date: "December 9 at 11:43 AM",
    datetime: "2020-12-09T11:43:00",
    href: "#",
    title: "What would you have done differently if you ran Jurassic Park?",
    body: `
      <p>Jurassic Park was an incredible idea and a magnificent feat of engineering, but poor protocols and a disregard for human safety killed what could have otherwise been one of the best businesses of our generation.</p>
      <p>Ultimately, I think that if you wanted to run the park successfully and keep visitors safe, the most important thing to prioritize would be&hellip;</p>
    `,
  },
  // More questions...
];

const profile = {
  name: "Ricardo Cooper",
  imageUrl:
    "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/1508621/354c8d6c37534e89b19496e3a57a6db9/eyJ3IjoyMDB9/2.jpg?token-time=2145916800&token-hash=Rdn_1H1Fy4rrDbhki3Fg1FgP__4SGg1VVWi1M07tCiI%3D",
  coverImageUrl:
    "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/1508621/f94433d93b3e45ec9d49977d11661f0b/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/7.jpg?token-time=1664841600&token-hash=KdJNvopd-E-JArd_mfYRGWjtR0tmitXl9AGDsq0yXKc%3D",
  about: `
    <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,
  fields: {
    Phone: "(555) 123-4567",
    Email: "ricardocooper@example.com",
    Title: "Senior Front-End Developer",
    Team: "Product Development",
    Location: "San Francisco",
    Sits: "Oasis, 4th floor",
    Salary: "$145,000",
    Birthday: "June 8, 1990",
  },
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <Layout>
      <div className="border border-red-500">
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
          {/* Side column */}
          <aside className="hidden xl:col-span-4 xl:block">
            <div className="sticky top-4 space-y-4">
              {/* Homebase info */}
              <section aria-labelledby="about-heading">
                <div className="rounded-lg bg-white shadow overflow-hidden pb-4">
                  <img
                    className="h-32 w-full object-cover lg:h-48"
                    src={profile.coverImageUrl}
                    alt=""
                  />
                  <div className="px-6 -mt-12 sm:-mt-16 ">
                    <img
                      className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 border border-stone-50"
                      src={profile.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="px-6 py-4">
                    <h2
                      id="about-heading"
                      className="text-xl font-medium text-stone-900"
                    >
                      True Crime Obsessed
                    </h2>
                    <h3 className="text-lg font-medium text-emerald-700 mt-1">
                      @truecrimeobsessed.lens
                    </h3>
                    <p className="mt-2">
                      Creating podcasts of the non-garbage variety. Get instant
                      access to our full archive of bonus content, including
                      extended outtakes, mini episodes, and additional bonus
                      episodes!
                    </p>
                  </div>
                </div>
              </section>
              {/* Show list of existing homebases here */}
            </div>
          </aside>

          {/* Main feed */}
          <main className="lg:col-span-9 xl:col-span-6 space-y-4">
            {/* If creator, create post */}
            <section aria-labelledby="create-post-heading">
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2
                    id="create-post-heading"
                    className="text-base font-medium text-gray-900"
                  >
                    Create post
                  </h2>
                  <div className="mt-6 flow-root"></div>
                </div>
              </div>
            </section>
            {/* Feed */}
            <div>
              <h1 className="sr-only">Feed</h1>
              <ul role="list" className="space-y-4">
                {questions.map((question) => (
                  <li
                    key={question.id}
                    className="bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6"
                  >
                    <article aria-labelledby={"question-title-" + question.id}>
                      <div>
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={question.author.imageUrl}
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              <a
                                href={question.author.href}
                                className="hover:underline"
                              >
                                {question.author.name}
                              </a>
                            </p>
                            <p className="text-sm text-gray-500">
                              <a
                                href={question.href}
                                className="hover:underline"
                              >
                                <time dateTime={question.datetime}>
                                  {question.date}
                                </time>
                              </a>
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 self-center">
                            {question.locked === "true" ? (
                              <>
                                <span className="sr-only">Private</span>
                                <LockClosedIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </>
                            ) : (
                              <>
                                <span className="sr-only">Public</span>
                                <GlobeAltIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <h2
                          id={"question-title-" + question.id}
                          className="mt-4 text-base font-medium text-gray-900"
                        >
                          {question.title}
                        </h2>
                      </div>
                      <div
                        className="mt-2 space-y-4 text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: question.body }}
                      />
                      <div className="mt-6 flex justify-between space-x-8">
                        <div className="flex space-x-6">
                          <span className="inline-flex items-center text-sm">
                            <button
                              type="button"
                              className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                            >
                              <HeartIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="font-medium text-gray-900">
                                {question.likes}
                              </span>
                              <span className="sr-only">likes</span>
                            </button>
                          </span>
                          <span className="inline-flex items-center text-sm">
                            <button
                              type="button"
                              className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                            >
                              <ChatBubbleLeftEllipsisIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="font-medium text-gray-900">
                                {question.replies}
                              </span>
                              <span className="sr-only">replies</span>
                            </button>
                          </span>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
