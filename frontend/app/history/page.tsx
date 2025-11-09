"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Clock,
  FileText,
  ArrowUpDown,
  Filter,
  X,
  Eye,
  Edit3,
  Sparkles,
  TrendingUp,
  Trash,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useBlogStore } from "@/store/blogStore";
import { useRouter } from "next/navigation";

const History = () => {
  const {
    blogs,
    getBlogs,
    loading,
    error,
    searchBlog,
    clearSearch,
    deleteBlog
  } = useBlogStore();

  const [query, setQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchBlog(query);
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchBlog, clearSearch]);

  const handleClear = () => {
    setQuery("");
    clearSearch();
  };

  const handleDelete = async (id: string) => {
    await deleteBlog(id)
  }

  

  const getSEOColor = (score: number) => {
    if (score >= 90)
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (score >= 80) return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Content Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Your complete archive of AI-generated blog posts
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {blogs.length}
                  </p>
                </div>
                <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Avg SEO Score
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {blogs.length > 0
                      ? Math.round(
                          blogs.reduce((acc, b) => acc + b.seoScore, 0) /
                            blogs.length
                        )
                      : 0}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Words
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {blogs
                      .reduce((acc, b) => acc + b.wordCount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
              size={20}
            />
            <Input
              className="pl-12 pr-4 py-6 h-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic, or tags..."
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto py-3 px-5 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto py-3 px-5 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowUpDown size={16} />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </div>
        </div> */}

        {/* Blog History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:scale-[1.02] overflow-hidden rounded-2xl"
            >
              <div className="h-2 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    {blog.tone}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getSEOColor(
                      blog.seoScore
                    )}`}
                  >
                    SEO {blog.seoScore}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {blog.topic}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                    >
                      +{blog.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <FileText size={14} />
                    </div>
                    <span className="font-medium">
                      {blog.wordCount.toLocaleString()}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Clock size={14} />
                    </div>
                    <span className="font-medium">{blog.readingTime} min</span>
                  </div> */}
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar size={14} />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/history/${blog.id}`)}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs font-medium rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                    >
                      <Eye size={14} className="mr-1.5" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(blog.id)}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10 rounded-3xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No content yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Start your content journey by generating your first AI-powered
                blog post. It only takes a few clicks!
              </p>
              <Button className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 h-auto rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                <Sparkles size={18} className="mr-2" />
                Create Your First Blog
              </Button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {blogs.length > 0 && blogs.length >= 10 && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="px-8 py-6 h-auto rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
            >
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
