export default async function Page({
    params,
  }: {
    params: Promise<{ trackableId: string }>
  }) {
    const { trackableId } = await params;
    return <div>My trackableId: {trackableId}</div>
  }