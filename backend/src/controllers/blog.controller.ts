import { Request, Response } from "express";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Blog from "../models/blog.model";
import { blogSchema } from "../schema/blog.schema";
import GenerationHistory from "../models/history.model";

export const generateBlog = async (req: Request, res: Response) => {
  try {
    // get logged in user
    const userId = (req as any).user.id;

    // Step 1: Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    //  Step 2: Validate blog data (without userId)
    const parsedData = await blogSchema
      .omit({ userId: true })
      .parseAsync(req.body);

    const { title, topic, tone, tags, metaDescription } = parsedData;

    //  Step 3: Initialize Gemini model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-pro",
      temperature: 0.7,
      apiKey: process.env.GEMINI_API_KEY,
    });

    //  Step 4: Create the prompt
    const template = `
      You are an expert SEO blog writer.
      Write a detailed and SEO-optimized blog post based on the following details.

      Title: {title}
      Topic: {topic}
      Tone: {tone}

      Requirements:
      - Maintain a {tone} writing style.
      - Add introduction, main sections, and conclusion.
      - Include headings, bullet points, and examples if relevant.
      - Optimize naturally for search engines (SEO).
      - Keep it engaging, human-like, and easy to read.
      - If user ask for any technical blog like jwt authentication or something like that give code examples and explain

      Output only the final blog content in Markdown format.
    `;

    const prompt = new PromptTemplate({
      template,
      inputVariables: ["title", "topic", "tone", "content"],
    });

    const formattedPrompt = await prompt.format({
      title,
      topic,
      tone,
      content: undefined,
    });

    // Step 5: Generate blog using Gemini
    const response = await model.invoke(formattedPrompt);

    const generatedContent =
      typeof response.content === "string"
        ? response.content
        : response.content?.[0]?.text ??
          response.content?.[0] ??
          JSON.stringify(response.content);

    //  Step 6: Compute word count and reading time
    const contentStr =
      typeof generatedContent === "string" ? generatedContent : "";
    const wordCount = contentStr.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200); // average reading speed

    //  Step 7: Create blog document in MongoDB
    const newBlog = await Blog.create({
      userId,
      title,
      topic,
      tone,
      content: generatedContent,
      wordCount,
      readingTime,
      metaDescription,
      tags,
      seoScore: parsedData.seoScore ?? Math.floor(Math.random() * 20) + 80,
      exportFormats: {
        markdown: generatedContent,
      },
    });

    const startTime = Date.now();

    const endTime = Date.now();

    // log generation history
    await GenerationHistory.create({
      userId,
      blogId: newBlog._id,
      prompt: formattedPrompt,
      tokensUsed: response.usage_metadata?.total_tokens ?? 0,
      cost: ((response.usage_metadata?.total_tokens ?? 0) * 0.00002).toFixed(4),
      duration: (endTime - startTime) / 1000,
    });

    //  Step 8: Respond with success
    return res.status(201).json({
      success: true,
      message: "Blog generated successfully",
      blog: newBlog,
    });
  } catch (error: any) {
    console.error(" Error generating blog:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get users blog
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "unauthorize" });
    }

    const rawBlogs = await Blog.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    let count = rawBlogs.length;

    // total word count (sum of all blog.wordCount)
    const totalWords = rawBlogs.reduce((sum, blog) => {
      const words = blog.wordCount || 0; 
      return sum + words;
    }, 0);

    const blogs = rawBlogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      topic: blog.topic,
      tone: blog.tone,
      wordCount: blog.wordCount,
      tags: blog.tags,
      metaDescription: blog.metaDescription,
      seoScore: blog.seoScore,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      markdown: blog.exportFormats?.markdown || "",
      html: blog.exportFormats?.html || "",
      pdfUrl: blog.exportFormats?.pdfUrl || "",
    }));

    return res.status(200).json({
      success: true,
      message: "blogs fetched successfully",
      totalWords,
      count,
      blogs,
    });
  } catch (error) {
    console.log("Errir in get blogs controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteBlogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "blog not found" });
    }

    await Blog.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: false, message: "blog deleted successfully" });
  } catch (error) {
    console.log("Error in delete blogs controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateBlogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const blog = await Blog.findOne({ _id: id, userId });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const { title, topic, tone, tags, metaDescription, content } = req.body;

    // Apply update only if provided
    if (title) blog.title = title;
    if (topic) blog.topic = topic;
    if (tone) blog.tone = tone;
    if (tags) blog.tags = tags;
    if (metaDescription) blog.metaDescription = metaDescription;

    if (content) {
      // Use bracket notation to avoid TypeScript errors
      (blog as any).content = content;
      blog.wordCount = content.split(/\s+/).length;
      blog.readingTime = Math.ceil(blog.wordCount / 200);

      // Also update exportFormats.markdown if you use it
      if (blog.exportFormats) {
        (blog.exportFormats as any).markdown = content;
      }
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log("Error in update blogs controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "you are not authorize" });
    }

    const { id } = req.params;

    const blog = await Blog.findById(id);

    return res.status(200).json({
      success: true,
      message: "blog by id fetched successfully",
      blog,
    });
  } catch (error) {
    console.log("Error in get blog by id controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const searchBlog = async (req: Request, res: Response) => {
  try {
    const { q: searchQuery, field = "title" } = req.query;

    if (!searchQuery || typeof searchQuery !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Option 1: Search across multiple fields
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { topic: { $regex: searchQuery, $options: "i" } },
      ],
    });

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found matching your search",
      });
    }
    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.log("Error in search blog controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
