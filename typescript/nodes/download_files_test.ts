import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { downloadFiles } from "./download_files.ts";
import { State } from "../state.ts";
import { Next, Nextable } from "../ambler.ts";

Deno.test("downloadFiles should call downloader for each URL and transition to onSuccess", async () => {
  const downloaded: { url: string; folder: string }[] = [];
  const mockDownloader = async (url: string, folder: string) => {
    downloaded.push({ url, folder });
  };

  const initialState: State = {
    m3uFilePath: "/path/to/my-playlist.m3u",
    urls: ["http://example.com/1.mp3", "http://example.com/2.mp3"],
  };

  let capturedState: State | undefined;
  const onSuccess: Nextable<State> = async (state: State) => {
    capturedState = state;
    return null;
  };

  const node = downloadFiles(
    { onSuccess },
    { downloader: mockDownloader }
  );
  const next = await node(initialState);

  if (!next) {
    throw new Error("Expected Next object, got null");
  }

  await next.run();

  assertEquals(downloaded.length, 2);
  assertEquals(downloaded[0], { url: "http://example.com/1.mp3", folder: "my-playlist" });
  assertEquals(downloaded[1], { url: "http://example.com/2.mp3", folder: "my-playlist" });
  assertEquals(capturedState, initialState);
});

Deno.test("downloadFiles should throw an error if m3uFilePath is missing", async () => {
  const mockDownloader = async (_url: string, _folder: string) => {};
  const onSuccess: Nextable<State> = async (_state: State) => null;

  const initialState: State = {
    m3uFilePath: null,
    urls: ["http://example.com/1.mp3"],
  };

  const node = downloadFiles(
    { onSuccess },
    { downloader: mockDownloader }
  );

  await assertRejects(
    () => node(initialState),
    Error,
    "M3U file path is not defined."
  );
});
