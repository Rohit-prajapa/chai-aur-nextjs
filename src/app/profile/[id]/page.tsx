type UserProfileProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfile({ params }: UserProfileProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Profile</h1>

      <span className="p-2 text-4xl">{id}</span>
    </div>
  );
}
