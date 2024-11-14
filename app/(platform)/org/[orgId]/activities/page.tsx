const OrgActivitiesPage = async ({ params }: { params: { orgId: string } }) => {
  const { orgId } = await params;
  return <div>OrgActivitiesPage: {orgId}</div>;
};

export default OrgActivitiesPage;
