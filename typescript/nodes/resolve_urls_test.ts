import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { resolveUrls } from "./resolve_urls.ts";
import { State } from "../state.ts";
import { Next, Nextable } from "../ambler.ts";

Deno.test("resolveUrls should resolve only Khinsider URLs using provided resolver", async () => {
  // Mock dependencies
  const mockResolver = async (url: string) => {
    return `resolved-${url}`;
  };

  const initialState: State = {
    m3uFilePath: "test.m3u",
    urls: [
      "https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3",
      "https://example.com/other.mp3"
    ]
  };

  const expectedUrls = [
    "resolved-https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3",
    "https://example.com/other.mp3"
  ];

  // To verify the state was passed correctly, we can modify mockOnSuccess to capture it
  let capturedState: State | undefined;
  const capturingOnSuccess: Nextable<State> = async (state: State) => {
    capturedState = state;
    return null;
  };

  const nodeWithCapture = resolveUrls(capturingOnSuccess, mockResolver);
  const nextWithCapture = await nodeWithCapture(initialState);
  
  if (!nextWithCapture) {
    throw new Error("Expected Next object, got null");
  }

  await nextWithCapture.run();

  if (!capturedState) {
    throw new Error("Captured state was not set");
  }

  assertEquals(capturedState.urls, expectedUrls);
});
