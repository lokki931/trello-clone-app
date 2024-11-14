const OrgBoardPage = async ({ params }: { params: { orgId: string } }) => {
  const { orgId } = await params;
  return <div>OrgBoardPage: {orgId}</div>;
};

export default OrgBoardPage;
