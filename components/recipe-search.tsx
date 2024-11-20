"use client";
import React, { useState, FormEvent } from "react"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import Link from "next/link"; 
import {  SearchIcon, X } from "lucide-react"; 
import  Spinner  from "@/components/ui/spinner"; 
import Image from "next/image";

interface Recipe{
    uri:string;
label:string;
image:string;
ingredientLines:string[];
ingredients:{text:string}[];
url:string
}

const examples = [  "Biryani",  "Chicken Karahi",  "Nihari",  "Haleem",  "Chapli Kabab",];

export default function RecipeSearch() {

const[query,setQuery]=useState<string>("")
const [recipes,setRecipes]=useState<Recipe[]>([])
const [loading,setLoading]=useState<boolean>(false)
const [searched,setSearched]=useState<boolean>(false)

const handleSearch=async(event:FormEvent)=>{
event.preventDefault()
setLoading(true)
setSearched(true)
setRecipes([])
try {
    const response=await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=c1924dea&app_key=e4e5f1239d11f028ff3aa5694e45bb24`
    )
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
const data=await response.json()
setRecipes(data.hits.map((hit:{recipe:Recipe})=>hit.recipe))

} catch (error) {
    console.error("Error fetching recipes:", error)
}finally{
    setLoading(false)
}
}



    return(
        <>
<div className= "flex flex-col h-full w-full max-w-6xl mx-auto p-4 items-center">
<header className="py-5 space-y-4 flex flex-col ">
<h1 className="text-3xl r font-bold">Recipe Search</h1>
<p className=" text-xl mb-5">Find delicious recipes by ingredients you have at home.</p>

<p className=" text-lg">Try Searching for:</p>
<div className="flex flex-wrap space-x-3 gap-y-2">
{examples.map((example)=>(
    <span
    key={example}
    onClick={()=>setQuery(example)}
    className="bg-gray-300 px-3 py-2 rounded-lg cursor-pointer">{example}</span>
))}
</div>
<form onSubmit={handleSearch} className="relative w-full max-w-md mb-6">
<Input 
value={query}
placeholder="Search by ingriedient..."
onChange={(e)=>setQuery(e.target.value)}
className="pr-10"/>

<X onClick={()=>setQuery("")} className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5"/>
<Button variant={"ghost"} size={"icon"} className="absolute right-2 top-1/2 -translate-y-1/2">
    <SearchIcon className="w-5 h-5"/>
</Button>
</form>
</header>
{loading?(
    <div className="flex justify-center"><Spinner/></div>
):(
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
 {searched && recipes.length === 0 && (
            <p className="">No recipes found. Try searching with different ingredients.</p>
          )}
{recipes.map((recipe)=>(
    <Card className="group relative"
    key={recipe.uri}>
<Image
src={recipe.image}
width={900}
height={900}
alt={recipe.label}
className="rounded-t-lg object-cover w-full h-48 group-hover:opacity-50 transition-opacity"/>
<CardContent className="p-4">
    <h1 className="text-xl font-bold mb-2">{recipe.label}</h1>
    <p className="text-muted-foreground line-clamp-2 ">{recipe.ingredientLines.join(", ")}</p>
</CardContent>
<Link
                href={recipe.url}
                className="absolute inset-0  z-10"
                prefetch={false}
              >
                <span className="sr-only">View recipe</span>
              </Link>
    </Card>
))}

    </div>
)}
</div>

        </>
    )
}