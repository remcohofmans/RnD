import React from 'react';

const ChatsPageSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Chats List Skeleton */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: Chat Window Skeleton */}
          <div className="md:col-span-6">
            <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'} rounded-lg p-4 max-w-[70%] animate-pulse`}>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column: User Card Skeleton */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2 w-full">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
                </div>
                <div className="space-y-2 w-full pt-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPageSkeleton;