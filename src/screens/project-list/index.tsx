import React from "react";
import { SearchPanel } from "screens/project-list/search-panel";
import { List } from "screens/project-list/list";
import { useDebounce, useDocumentTitle } from "../../utils";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useUrlQueryParam } from "utils/url";

// 使用 JS 的同学，大部分的错误都是在 runtime(运行时) 的时候发现的
// 我们希望，在静态代码中，就能找到其中的一些错误 -> 强类型
export const ProjectListScreen = () => {
  // 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
  // https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  const debouncedParam = useDebounce(param, 200);
  const { isLoading, error, data: list } = useProjects(debouncedParam);
  const { data: users } = useUsers();
  useDocumentTitle("项目列表", false);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
