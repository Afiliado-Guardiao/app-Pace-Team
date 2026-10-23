import React from "react";
import { Text } from "react-native";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { ActivityGauge, Podium, ProgressBar, RankRow, StatTile } from "../data";
import { PACE_TABS, TabBar, TopBar } from "../navigation";
import { GlassCard, Sheet, Toast, Tooltip } from "../surfaces";

// Com "reduzir movimento", números e arcos vão direto ao valor final
jest.mock("react-native-reanimated", () => {
	const actual = jest.requireActual<Record<string, unknown>>("react-native-reanimated");
	return { __esModule: true, ...actual, default: actual.default, useReducedMotion: () => true };
});

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("PACE surfaces", () => {
	it("GlassCard renders children and handles presses", () => {
		const onPress = jest.fn();
		render(
			<GlassCard onPress={onPress} testID="card">
				<Text>Pace Sharks</Text>
			</GlassCard>,
		);
		expect(screen.getByText("Pace Sharks")).toBeTruthy();
		fireEvent.press(screen.getByTestId("card"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("Sheet renders nothing when closed", () => {
		render(<Sheet open={false} title="Finalizar corrida?" contained />);
		expect(screen.queryByText("Finalizar corrida?")).toBeNull();
	});

	it("Sheet closes from the scrim", () => {
		const onClose = jest.fn();
		render(
			<Sheet title="Finalizar corrida?" onClose={onClose} contained testID="sheet">
				Os pontos contam após a verificação.
			</Sheet>,
		);
		expect(screen.getByText("Os pontos contam após a verificação.")).toBeTruthy();
		fireEvent.press(screen.getByTestId("sheet-scrim"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("Toast runs its action", () => {
		const onPress = jest.fn();
		render(<Toast title="Virada!" message="+57 pts" action={{ label: "Ver", onPress }} />);
		fireEvent.press(screen.getByTestId("pace-toast-action"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("Tooltip renders its text", () => {
		render(<Tooltip accent>+52 pts</Tooltip>);
		expect(screen.getByText("+52 pts")).toBeTruthy();
	});
});

describe("PACE data", () => {
	it("RankRow shows the VOCÊ tag for the user's team", () => {
		render(
			<RankRow position={4} name="Pace Sharks" city="Campinas" points="2.140" delta={2} isYou />,
		);
		expect(screen.getByText("Pace Sharks")).toBeTruthy();
		expect(screen.getByText("VOCÊ")).toBeTruthy();
		expect(screen.getByText("Campinas")).toBeTruthy();
	});

	it("Podium renders the top three", () => {
		const onSelect = jest.fn();
		const teams = [
			{ name: "Lobos SP", points: "3.120" },
			{ name: "Night Runners", points: "2.980" },
			{ name: "Trail Kings", points: "2.755" },
		];
		render(<Podium teams={teams} onSelect={onSelect} />);
		fireEvent.press(screen.getByTestId("pace-podium-1"));
		expect(onSelect).toHaveBeenCalledWith(teams[0]);
	});

	it("StatTile renders label and unit", () => {
		render(<StatTile icon="route" label="Distância" value="10,58" unit="km" />);
		expect(screen.getByText("Distância")).toBeTruthy();
		expect(screen.getByText("km")).toBeTruthy();
	});

	it("ProgressBar exposes its value", () => {
		render(<ProgressBar value={60} label="Meta semanal" valueLabel="60%" />);
		expect(screen.getByText("Meta semanal")).toBeTruthy();
	});

	it("ActivityGauge renders its label", () => {
		render(<ActivityGauge value={72} label="Pontos da semana" />);
		expect(screen.getByText("Pontos da semana")).toBeTruthy();
	});
});

describe("PACE navigation", () => {
	it("TabBar (horizontal) changes tab", () => {
		const onChange = jest.fn();
		render(<TabBar active="home" onChange={onChange} />);
		fireEvent.press(screen.getByTestId("pace-tab-ranking"));
		expect(onChange).toHaveBeenCalledWith("ranking");
	});

	it("TabBar (vertical rail) renders all five tabs", () => {
		const onChange = jest.fn();
		render(<TabBar orientation="vertical" size={42} active="team" onChange={onChange} />);
		PACE_TABS.forEach((tab) => {
			expect(screen.getByLabelText(tab.label)).toBeTruthy();
		});
		fireEvent.press(screen.getByTestId("pace-rail-profile"));
		expect(onChange).toHaveBeenCalledWith("profile");
	});

	it("TopBar wires back and right actions", () => {
		const onBack = jest.fn();
		const onRight = jest.fn();
		render(
			<TopBar
				title="Criar conta"
				onBack={onBack}
				right={{ icon: "bell", label: "Notificações", onPress: onRight }}
			/>,
		);
		fireEvent.press(screen.getByTestId("pace-topbar-back"));
		fireEvent.press(screen.getByTestId("pace-topbar-right"));
		expect(onBack).toHaveBeenCalledTimes(1);
		expect(onRight).toHaveBeenCalledTimes(1);
	});
});
