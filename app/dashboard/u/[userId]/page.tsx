export default function UserIdPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  return <div style={{ textAlign: 'center' }}>{userId}</div>;
}
