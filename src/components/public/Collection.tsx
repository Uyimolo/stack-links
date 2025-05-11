"use client";

import { useSingleCollection } from "@/hooks/useCollectionHooks";
import { useLinks } from "@/hooks/useLinkHooks";
import { Paragraph } from "../global/Text";
import Loading from "../global/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/global/Button";
import Link from "next/link";
import { Logo } from "../global/Logo";
import { toast } from "sonner";
import Empty from "../global/Empty";

const Collection = ({ collectionId }: { collectionId: string }) => {
  const { collection } = useSingleCollection(collectionId);
  const userId = collection?.ownerId || "";
  const { links } = useLinks(userId, collectionId);

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      (err) => {
        toast.error("Could not copy text: ", err);
      },
    );
  };

  if (collection === undefined) {
    return <Loading />;
  }

  if (collection?.visibility !== "public") {
    return (
      <div
        className="min-h-screen flex flex-col w-full bg-cover bg-center items-start"
        style={{
          backgroundImage:
            "url(/assets/svgs/massimiliano-morosinotto-Tw_VQuS3Xio-unsplash.webp)",
        }}
      >
        <header className="flex justify-between w-full items-center p-4">
          <Link href="/">
            <Logo />
          </Link>
          <Button variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </header>

        <div className=" w-full place-content-center">
          <Empty text="This collection is private or unlisted" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover bg-fixed bg-black/70 bg- bg-blend-multiply bg-center"
      style={{
        backgroundImage:
          "url(/assets/svgs/massimiliano-morosinotto-Tw_VQuS3Xio-unsplash.webp)",
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Link href="/">
          <Logo />
        </Link>
        <Button size="sm" variant="secondary">
          <Link href="/">Back Home</Link>
        </Button>
      </header>

      {/* Collection Info */}
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        {collection.imageUrl && (
          <div
            className="w-[150px] aspect-square bg-cover bg-center rounded-full border-4 border-primary"
            style={{ backgroundImage: `url(${collection.imageUrl})` }}
          />
        )}
        <Paragraph className="text-center text-grey-6 text-xl capitalize font-bold">
          {collection.name}
        </Paragraph>
        {collection.description && (
          <Paragraph className="text-center text-grey-5 text-sm max-w-md">
            {collection.description}
          </Paragraph>
        )}
      </div>

      {/* Links */}
      <div className="flex flex-col items-center justify-center w-full max-w-sm lg:max-w-xl mx-auto gap-4 p-4">
        {links === undefined && <Loading className="h-40" />}

        {links
          ?.filter((link) => link.visibility !== "private")
          .map((link, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-2 overflow-hidden rounded-full bg-white p-1 shadow-sm hover:shadow-md transition"
            >
              <div
                className="bg-grey-3 aspect-square w-12 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${link.imageUrl || "/assets/svgs/default-link.svg"})`,
                }}
              />

              <Paragraph className="flex-1 text-center line-clamp-1 capitalize text-sm">
                {link.title}
              </Paragraph>

              <DropdownMenu>
                <DropdownMenuTrigger className="w-10">
                  <MoreVertical className="text-grey-1 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Link
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <button onClick={() => copyTextToClipboard(link.url)}>
                      Copy Link
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Collection;
