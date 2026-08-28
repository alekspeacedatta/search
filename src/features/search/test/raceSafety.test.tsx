import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Search } from "../ui/Search";
import { getProducts } from "../api/getProducts";

vi.mock("../api/getProducts", () => ({
  getProducts: vi.fn(),
}));

vi.mock("../../../shared/utils/debouncer", () => ({
  debouncer: (fn: (...args: any[]) => void) => fn,
}));

vi.mock("../hooks/usePopState", async () => {
  const { useState } = await import("react");

  return {
    usePopState: () => {
      const [q, setQ] = useState("");

      return {
        filters: {
          q,
          selectedCategories: [],
          minPrice: "",
          maxPrice: "",
        },

        updateFilters: (updates: { q?: string }) => {
          if (updates.q !== undefined) {
            setQ(updates.q);
          }
        },
      };
    },
  };
});

vi.mock("../../../shared/ui/ProductCard", () => ({
  ProductCard: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("Search race safety", () => {
  it("discards an older response when it arrives after a newer response", async () => {
    let resolveLap!: (data: any) => void;
    let resolveLaptop!: (data: any) => void;

    vi.mocked(getProducts).mockImplementation((payload) => {
      if (payload.q === "") {
        return Promise.resolve({
          total: 0,
          results: [],
        });
      }

      if (payload.q === "lap") {
        return new Promise((resolve) => {
          resolveLap = resolve;
        });
      }

      if (payload.q === "laptop") {
        return new Promise((resolve) => {
          resolveLaptop = resolve;
        });
      }

      return Promise.resolve({
        total: 0,
        results: [],
      });
    });

    render(<Search />);

    const input = await screen.findByPlaceholderText("search for a product");

    fireEvent.change(input, {
      target: { value: "lap" },
    });

    fireEvent.change(input, {
      target: { value: "laptop" },
    });

    resolveLaptop({
      total: 1,
      results: [
        {
          id: 2,
          title: "Laptop",
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    resolveLap({
      total: 1,
      results: [
        {
          id: 1,
          title: "Lap Product",
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    expect(screen.queryByText("Lap Product")).not.toBeInTheDocument();
  });
});
